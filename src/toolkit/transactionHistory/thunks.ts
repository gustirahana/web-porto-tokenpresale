import { setLoading, setError, setTransactions } from './slice';
import Network from '../../utils/Network';

interface FetchTransactionHistoryParams {
    page: number;
    perPage: number;
    search?: string;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}

export const fetchTransactionHistory = (params: FetchTransactionHistoryParams) =>
    async (dispatch: any) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        
        try {
            const userId = localStorage.getItem('user');
            if (!userId) {
                throw new Error('User ID not found');
            }

            const queryParams = new URLSearchParams();
            queryParams.append('page', params.page.toString());
            queryParams.append('perPage', params.perPage.toString());
            
            if (params.search) {
                queryParams.append('search', params.search);
            }

            const response = await Network.get(`/users/${userId}/transaction?${queryParams.toString()}`);
            
            dispatch(setTransactions({
                transactions: response.data || [],
                recordsTotal: response.recordsTotal || 0,
                recordsFiltered: response.recordsFiltered || 0
            }));
            
            return response;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch transaction history';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

export const fetchTransactionById = (transactionId: string) =>
    async (dispatch: any) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        
        try {
            const response = await Network.get(`transaction-history/${transactionId}`);
            return response.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch transaction details';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

export const updateTransactionStatus = (transactionId: string, status: string) =>
    async (dispatch: any) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        
        try {
            const response = await Network.put(`transaction-history/${transactionId}/status`, { status });
            return response.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update transaction status';
            dispatch(setError(errorMessage));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };
