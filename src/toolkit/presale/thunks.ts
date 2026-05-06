import { setLoading, setError, setPresales, setLeaderboard } from './slice';
import Network from '../../utils/Network';

export const fetchPresales = () => async (dispatch: any) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
        const userId = localStorage.getItem('user');
        if (!userId) {
            throw new Error('User ID not found');
        }

        const response = await Network.get(`/users/${userId}/presales?page=1&perPage=100`);
        const presalesData = response.data || response;
        const presalesArray = Array.isArray(presalesData) ? presalesData : (presalesData.data || []);
        dispatch(setPresales(presalesArray));
        return presalesArray;
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch presales';
        dispatch(setError(errorMessage));
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

export const fetchLeaderboard = () => async (dispatch: any) => {
    try {
        const response = await Network.get('presale/leaderboard');
        const data = response.data?.data || response.data || [];
        dispatch(setLeaderboard(data));
        return data;
    } catch (error: any) {
        console.error("Failed to fetch leaderboard:", error);
        return [];
    }
};
