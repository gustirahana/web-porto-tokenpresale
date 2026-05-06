// utils/network.ts
import axios, { type AxiosRequestConfig, AxiosError } from 'axios';
import { Mutex } from 'async-mutex';
import crypto from './cryto';
import { store } from '../store';
import { setAuth, clearAuth } from '../toolkit/auth/slice';

const q = {
    app: import.meta.env.VITE_APP_NAME,
    version: import.meta.env.VITE_APP_VERSION
};
const signature = crypto.enc(q);
const mutex = new Mutex();

class Network {
    private get baseURL() {
        return import.meta.env.VITE_API_BASE_URL;
    }

    private get authState() {
        return store.getState().auth;
    }

    private async refreshTokens() {
        const { tokens } = this.authState;
        if (!tokens?.token?.refreshToken) throw new Error('No refresh token available');

        try {
            const response = await axios.post<{
                accessToken: string;
                refreshToken: string;
            }>(
                `${this.baseURL}/auth/refresh-token`,
                {
                    refreshToken: tokens?.token?.refreshToken
                },
                { headers: { signature } }
            );

            const newTokens = {
                ...tokens,
                token: {
                    ...tokens.token,
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken
                }
            };

            store.dispatch(setAuth(newTokens));
            return newTokens.token.accessToken;
        } catch (error) {
            this.handleAuthError();
            throw error;
        }
    }

    private handleAuthError() {
        store.dispatch(clearAuth());
        // Use window.location for immediate redirect
        window.location.href = '/login';
    }

    private async request<T = any>(config: AxiosRequestConfig): Promise<T> {
        await mutex.waitForUnlock();
        const { tokens } = this.authState;

        const requestConfig: AxiosRequestConfig = {
            ...config,
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
                signature,
                ...(tokens?.token?.accessToken && {
                    Authorization: `Bearer ${tokens.token?.accessToken}`
                }),
                ...config.headers
            }
        };

        try {
            const response = await axios(requestConfig);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                const status = axiosError.response?.status;
                const errorMessage = axiosError.response?.data?.message || axiosError.message || '';
                
                // Handle JWT/Token related errors
                if (status === 401 && 
                    errorMessage.toLowerCase().includes('jwt') || 
                    errorMessage.toLowerCase().includes('token')) {
                    
                    // Try to refresh token if it's a 401 and we have a refresh token
                    if (status === 401 && this.authState.tokens?.token?.refreshToken && !mutex.isLocked()) {
                        const release = await mutex.acquire();
                        try {
                            const newToken = await this.refreshTokens();
                            const retryResponse = await axios({
                                ...requestConfig,
                                headers: {
                                    ...requestConfig.headers,
                                    Authorization: `Bearer ${newToken}`
                                }
                            });
                            return retryResponse.data;
                        } finally {
                            release();
                        }
                    } else {
                        // If refresh fails or no refresh token, logout and redirect
                        this.handleAuthError();
                        throw new Error('Authentication failed. Please login again.');
                    }
                }
            }
            throw error;
        }
    }

    // HTTP Methods remain exactly as before
    get<T = any>(url: string, config?: AxiosRequestConfig) {
        return this.request<T>({ method: 'GET', url, ...config });
    }

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.request<T>({ method: 'POST', url, data, ...config });
    }

    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.request<T>({ method: 'PUT', url, data, ...config });
    }

    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.request<T>({ method: 'PATCH', url, data, ...config });
    }

    delete<T = any>(url: string, config?: AxiosRequestConfig) {
        return this.request<T>({ method: 'DELETE', url, ...config });
    }
}

export default new Network();