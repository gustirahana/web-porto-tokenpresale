import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RegisterState {
    isLoading: boolean;
    error: string | null;
    isSuccess: boolean;
}

const initialState: RegisterState = {
    isLoading: false,
    error: null,
    isSuccess: false,
};

const registerSlice = createSlice({
    name: 'registration',
    initialState,
    reducers: {
        setRegisterLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setRegisterError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        setRegisterSuccess(state, action: PayloadAction<boolean>) {
            state.isSuccess = action.payload;
        },
        resetRegisterState() {
            return initialState;
        },
    },
});

export const { setRegisterLoading, setRegisterError, setRegisterSuccess, resetRegisterState } = registerSlice.actions;
export default registerSlice.reducer;

