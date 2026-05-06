import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DepositState {
    topupAddress: string;
    isFetchingAddress: boolean;
    isConfirming: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: DepositState = {
    topupAddress: '',
    isFetchingAddress: false,
    isConfirming: false,
    error: null,
    successMessage: null,
};

const depositSlice = createSlice({
    name: 'deposit',
    initialState,
    reducers: {
        setTopupAddress(state, action: PayloadAction<string>) {
            state.topupAddress = action.payload;
        },
        setFetchingAddress(state, action: PayloadAction<boolean>) {
            state.isFetchingAddress = action.payload;
        },
        setConfirming(state, action: PayloadAction<boolean>) {
            state.isConfirming = action.payload;
        },
        setDepositError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        setDepositSuccess(state, action: PayloadAction<string | null>) {
            state.successMessage = action.payload;
        },
    },
});

export const {
    setTopupAddress,
    setFetchingAddress,
    setConfirming,
    setDepositError,
    setDepositSuccess,
} = depositSlice.actions;

export default depositSlice.reducer;

