import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
    settings: any;
    isLoading: boolean;
    error: string | null;
}

const initialState: SettingsState = {
    settings: null,
    isLoading: false,
    error: null
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setSettings: (state, action: PayloadAction<any>) => {
            state.settings = action.payload;
            state.error = null;
        },
        updateSetting: (state, action: PayloadAction<{key: string, value: any}>) => {
            if (state.settings) {
                state.settings[action.payload.key] = action.payload.value;
            }
        },
        clearSettings: (state) => {
            state.settings = null;
            state.error = null;
        }
    }
});

export const { setLoading, setError, setSettings, updateSetting, clearSettings } = settingsSlice.actions;

// Selector
export const selectSettings = (state: any) => state.settings;

export default settingsSlice.reducer;
