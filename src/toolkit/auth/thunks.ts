import { setAuth, clearAuth, setLoading } from './slice';
import Network from '../../utils/Network';

export const login = (credentials: { username: string; password: string; platform: string; }) =>
    async (dispatch: any) => {
        dispatch(setLoading(true));
        try {
            const response = await Network.post('auth/signIn', credentials);
            console.log(response)
            dispatch(setAuth({
                tokens: response.data,
                username: response.data.user.username
            }));
            try {
                localStorage.setItem('username', credentials.username || '');
                localStorage.setItem('user', response?.data?.user?.id || '');
                try {
                    window.dispatchEvent(new CustomEvent('username-changed', { detail: response?.data?.user?.username || '' }));
                } catch {}
            } catch {}
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.message || error?.message || 'Login failed';
        } finally {
            dispatch(setLoading(false));
        }
    };

export const logout = () => (dispatch: any) => {
    dispatch(clearAuth());
    localStorage.clear()
    try {
        window.dispatchEvent(new CustomEvent('username-changed', { detail: null }));
    } catch {}
};

export const refreshToken = () => async (dispatch: any, getState: any) => {
    const { tokens } = getState().auth;
    if (!tokens?.refreshToken) throw new Error('No refresh token available');

    try {
        const response = await Network.post('/auth/refresh', {
            refreshToken: tokens.refreshToken
        });
        dispatch(setAuth(response.data));
        return response.data;
    } catch (error) {
        dispatch(clearAuth());
        throw error;
    }
};
