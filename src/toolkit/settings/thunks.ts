import { setLoading, setError, setSettings } from './slice';
import Network from '../../utils/Network';

export const fetchSettings = () =>
    async (dispatch: any) => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const response = await Network.get('users/settings');
            dispatch(setSettings(response.data || response));
            return response;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch settings';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

export const updateSettings = (settingsData: any) =>
    async (dispatch: any) => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const response = await Network.post('users/settings', settingsData);
            // dispatch(setSettings(response.data || response));
            return response;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update settings';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

export const resetSettings = () =>
    async (dispatch: any) => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const response = await Network.post('users/settings/reset');
            dispatch(setSettings(response.data || response));
            return response;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to reset settings';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };
