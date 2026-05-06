import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PresaleBatch {
    id: string;
    batch: number;
    allocation: number;
    price: number;
    sold: number;
    start_date: string;
    end_date: string;
    enabled: number;
}

export interface LeaderboardEntry {
    rank: number;
    displayName: string;
    spadstBalance: number;
    totalTransactions: number;
}

interface PresaleState {
    presales: PresaleBatch[];
    leaderboard: LeaderboardEntry[];
    isLoading: boolean;
    error: string | null;
}

const initialState: PresaleState = {
    presales: [],
    leaderboard: [],
    isLoading: false,
    error: null,
};

const presaleSlice = createSlice({
    name: 'presale',
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        setPresales(state, action: PayloadAction<PresaleBatch[]>) {
            state.presales = action.payload;
            state.error = null;
        },
        setLeaderboard(state, action: PayloadAction<LeaderboardEntry[]>) {
            state.leaderboard = action.payload;
        },
        clearPresales(state) {
            state.presales = [];
            state.leaderboard = [];
            state.error = null;
        },
    },
});

export const { setLoading, setError, setPresales, setLeaderboard, clearPresales } = presaleSlice.actions;
export default presaleSlice.reducer;

