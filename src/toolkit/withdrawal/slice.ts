import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WithdrawItem {
    id: string;
    date_created: string;
    username: string;
    amount: number | string;
    status: string;
    txHash?: string | null;
    docs?: string | null;
}

interface WithdrawalState {
    pendingWithdrawals: WithdrawItem[];
    rejectedWithdrawals: WithdrawItem[];
    completedWithdrawals: WithdrawItem[];
    recordsTotal: number;
    recordsFiltered: number;
    isLoading: boolean;
    isWithdrawing: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: WithdrawalState = {
    pendingWithdrawals: [],
    rejectedWithdrawals: [],
    completedWithdrawals: [],
    recordsTotal: 0,
    recordsFiltered: 0,
    isLoading: false,
    isWithdrawing: false,
    error: null,
    successMessage: null
};

const withdrawalSlice = createSlice({
    name: 'withdrawal',
    initialState,
    reducers: {
        setPendingWithdrawals(state, action: PayloadAction<{
            withdrawals: WithdrawItem[];
            recordsTotal: number;
            recordsFiltered: number;
        }>) {
            state.pendingWithdrawals = action.payload.withdrawals;
            state.recordsTotal = action.payload.recordsTotal;
            state.recordsFiltered = action.payload.recordsFiltered;
            state.error = null;
        },
        setRejectedWithdrawals(state, action: PayloadAction<{
            withdrawals: WithdrawItem[];
            recordsTotal: number;
            recordsFiltered: number;
        }>) {
            state.rejectedWithdrawals = action.payload.withdrawals;
            state.recordsTotal = action.payload.recordsTotal;
            state.recordsFiltered = action.payload.recordsFiltered;
            state.error = null;
        },
        setCompletedWithdrawals(state, action: PayloadAction<{
            withdrawals: WithdrawItem[];
            recordsTotal: number;
            recordsFiltered: number;
        }>) {
            state.completedWithdrawals = action.payload.withdrawals;
            state.recordsTotal = action.payload.recordsTotal;
            state.recordsFiltered = action.payload.recordsFiltered;
            state.error = null;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
        setWithdrawing(state, action: PayloadAction<boolean>) {
            state.isWithdrawing = action.payload;
        },
        setWithdrawalError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        setWithdrawalSuccess(state, action: PayloadAction<string | null>) {
            state.successMessage = action.payload;
        },
        clearWithdrawalState(state) {
            state.error = null;
            state.successMessage = null;
        }
    }
});

export const { 
    setPendingWithdrawals, 
    setRejectedWithdrawals, 
    setCompletedWithdrawals, 
    setLoading, 
    setError, 
    clearError,
    setWithdrawing,
    setWithdrawalError,
    setWithdrawalSuccess,
    clearWithdrawalState
} = withdrawalSlice.actions;

export default withdrawalSlice.reducer;
