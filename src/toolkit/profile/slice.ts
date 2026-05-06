import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Profile {
    id?: string;
    username?: string;
    email?: string;
    phone?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    walletAddress?: string;
    avatar?: string | null;
    packageName?: string;
    refUsername?: string | null;
    bonusSponsor?: number;
    bonusTotal?: number;
    status?: number;
    banned?: number;
    subscriptionExpired?: string;
    createdAt?: string;
    [key: string]: any;
}

interface ProfileState {
    profile: Profile | null;
    balance: number | null;
    pinBalance: number | null;
    isLoading: boolean;
    isBalanceLoading: boolean;
    error: string | null;
    balanceError: string | null;
}

const initialState: ProfileState = {
    profile: null,
    balance: null,
    pinBalance: null,
    isLoading: false,
    isBalanceLoading: false,
    error: null,
    balanceError: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        setProfile(state, action: PayloadAction<Profile | null>) {
            state.profile = action.payload;
            state.error = null;
        },
        clearProfile(state) {
            state.profile = null;
            state.error = null;
        },
        setBalanceLoading(state, action: PayloadAction<boolean>) {
            state.isBalanceLoading = action.payload;
        },
        setBalanceError(state, action: PayloadAction<string | null>) {
            state.balanceError = action.payload;
        },
        setBalance(state, action: PayloadAction<number | null>) {
            state.balance = action.payload;
            state.balanceError = null;
        },
        setPinBalance(state, action: PayloadAction<number | null>) {
            state.pinBalance = action.payload;
        },
    },
});

export const { setLoading, setError, setProfile, clearProfile, setBalanceLoading, setBalanceError, setBalance, setPinBalance } = profileSlice.actions;
export default profileSlice.reducer;

