import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BuyTokenState {
    isBuying: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: BuyTokenState = {
    isBuying: false,
    error: null,
    successMessage: null,
};

const buyTokenSlice = createSlice({
    name: 'buyToken',
    initialState,
    reducers: {
        setBuying(state, action: PayloadAction<boolean>) {
            state.isBuying = action.payload;
        },
        setBuyTokenError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        setBuyTokenSuccess(state, action: PayloadAction<string | null>) {
            state.successMessage = action.payload;
        },
        clearBuyTokenState(state) {
            state.error = null;
            state.successMessage = null;
        },
    },
});

export const {
    setBuying,
    setBuyTokenError,
    setBuyTokenSuccess,
    clearBuyTokenState,
} = buyTokenSlice.actions;

export default buyTokenSlice.reducer;

