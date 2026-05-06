import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Transaction {
    id: string;
    idMember: string;
    docs: {
        mode: string;
        type: string;
        amount: number;
        saldoAfter: number;
        saldoBefore: number;
        txHash?: string;
    };
    type: 'affiliate_bonus' | 'activation' | 'deposit' | 'withdrawal' | 'transfer' | 'refund';
    status: number; // 1 = completed, 0 = pending
    createdAt: string;
    updatedAt: string | null;
}

interface TransactionHistoryState {
    transactions: Transaction[];
    recordsTotal: number;
    recordsFiltered: number;
    isLoading: boolean;
    error: string | null;
}

const initialState: TransactionHistoryState = {
    transactions: [],
    recordsTotal: 0,
    recordsFiltered: 0,
    isLoading: false,
    error: null
};

const transactionHistorySlice = createSlice({
    name: 'transactionHistory',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setTransactions: (state, action: PayloadAction<{
            transactions: Transaction[];
            recordsTotal: number;
            recordsFiltered: number;
        }>) => {
            state.transactions = action.payload.transactions;
            state.recordsTotal = action.payload.recordsTotal;
            state.recordsFiltered = action.payload.recordsFiltered;
            state.error = null;
        },
        clearTransactions: (state) => {
            state.transactions = [];
            state.recordsTotal = 0;
            state.recordsFiltered = 0;
            state.error = null;
        }
    }
});

export const { setLoading, setError, setTransactions, clearTransactions } = transactionHistorySlice.actions;

// Selector
export const selectTransactionHistory = (state: any) => state.transactionHistory;

export default transactionHistorySlice.reducer;
