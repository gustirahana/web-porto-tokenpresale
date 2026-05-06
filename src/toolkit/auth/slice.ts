// toolkit/auth/slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    username: string;
}

interface AuthState {
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error?: string | null;
    username?: string | null;
}

const initialState: AuthState = {
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    username: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action: PayloadAction<{tokens: AuthTokens, username?: string}>) {
            state.tokens = action.payload.tokens;
            if (action.payload.username) {
                state.username = action.payload.username;
            }
            state.isAuthenticated = true;
            state.error = null;
        },
        clearAuth(state) {
            state.tokens = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        }
    }
});

export const { setAuth, clearAuth, setLoading } = authSlice.actions;
export default authSlice.reducer;