import {
    setPendingWithdrawals,
    setRejectedWithdrawals,
    setCompletedWithdrawals,
    setLoading,
    setError,
    setWithdrawing,
    setWithdrawalError,
    setWithdrawalSuccess
} from './slice';
import Network from '../../utils/Network';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

interface FetchWithdrawalsParams {
    page: number;
    perPage: number;
    search?: string;
    status: 0 | 1 | 2; // 0=pending, 1=completed, 2=rejected
}

export const fetchWithdrawals = ({ page, perPage, search, status }: FetchWithdrawalsParams) =>
    async (dispatch: any) => {
        dispatch(setLoading(true));
        try {
            let url = `users/withdrawal?page=${page}&perPage=${perPage}&status=${status}&dir=DESC`;

            if (search && search.length > 3) {
                url += `&search=${encodeURIComponent(search)}`;
            }

            const response = await Network.get(url);
            console.log(response)

            if (response.data) {
                const actionMap = {
                    0: setPendingWithdrawals,    // pending
                    1: setCompletedWithdrawals,  // completed
                    2: setRejectedWithdrawals    // rejected
                };

                dispatch(actionMap[status]({
                    withdrawals: response.data,
                    recordsTotal: response.recordsTotal,
                    recordsFiltered: response.recordsFiltered,
                }));
            } else {
                const err = new Error('Failed to fetch withdrawals: unexpected response');
                console.error(err.message, response);
                throw err;
            }

            return response;
        } catch (error: any) {
            console.error('Fetch withdrawals error:', error);

            // Check if it's a 401 with "expired" in the message
            if (error.response?.status === 401 &&
                (error.response?.data?.message?.toLowerCase().includes('expired') ||
                    error.response?.statusText?.toLowerCase().includes('expired'))) {
                const errorMessage = 'Token expired - please login again';
                console.warn(errorMessage);
                dispatch(setError(errorMessage));
                // Don't show toast for expired token, just set empty data
                const actionMap = {
                    0: setPendingWithdrawals,    // pending
                    1: setCompletedWithdrawals,  // completed
                    2: setRejectedWithdrawals    // rejected
                };
                dispatch(actionMap[status]({
                    withdrawals: [],
                    recordsTotal: 0,
                    recordsFiltered: 0,
                }));
                return { data: [], recordsTotal: 0, recordsFiltered: 0 };
            }

            const errorMessage = error.response?.data?.message ||
                error.response?.statusText ||
                'Failed to fetch withdrawals';

            toast.error(`Fetch failed: ${errorMessage}`);
            dispatch(setError(errorMessage));
            throw errorMessage;
        } finally {
            dispatch(setLoading(false));
        }
    };

interface WithdrawalActionParams {
    date: string;
    wallet: string;
}

export const approveWithdrawal = ({ date, wallet }: WithdrawalActionParams) =>
    async (_dispatch: any) => {
        try {
            const formattedDate = dayjs(date).format('YYYY-MM-DD');
            const body = {
                withdrawals: [{
                    date: formattedDate,
                    wallet: wallet
                }]

            };

            console.log('Approve withdrawal request body:', body);
            const response = await Network.post('users/approve-by-wallet', body);
            console.log(response.message)

            if (response.success) {
                return {
                    success: true,
                    message: response.message,
                    data: response.data
                };
            } else {
                throw new Error(response.message || 'Approval failed');
            }
        } catch (error: any) {
            const errorMessage = error.message ||
                error.status ||
                'Failed to approve withdrawal';
            return { success: false, message: errorMessage };
        }
    };

export const declineWithdrawal = ({ date, wallet }: WithdrawalActionParams) =>
    async (_dispatch: any) => {
        try {
            const formattedDate = dayjs(date).format('YYYY-MM-DD');
            const body = {
                date: formattedDate,
                wallet: wallet
            };

            console.log('Decline withdrawal request body:', body);

            const response = await Network.post('users/decline-by-wallet', body);

            if (response.success) {
                toast.success(response.message || 'Withdrawal declined successfully');
                return {
                    success: true,
                    message: response.message,
                    data: response.data
                };
            } else {
                throw new Error(response.message || 'Decline failed');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message ||
                error.response?.statusText ||
                'Failed to decline withdrawal';

            toast.error(`Decline failed: ${errorMessage}`);
            return { success: false, message: errorMessage };
        }
    };

export interface WithdrawTokenPayload {
    amount: number;
}

export const withdrawTokens = (payload: WithdrawTokenPayload) => async (dispatch: any) => {
    dispatch(setWithdrawing(true));
    dispatch(setWithdrawalError(null));
    dispatch(setWithdrawalSuccess(null));

    try {
        const userId = localStorage.getItem('user');
        if (!userId) {
            throw new Error('User ID not found');
        }

        const response = await Network.post(`/users/${userId}/withdraw`, payload);
        dispatch(setWithdrawalSuccess('Withdrawal request submitted successfully'));
        return response.data || response;
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to withdraw tokens';
        dispatch(setWithdrawalError(errorMessage));
        throw error;
    } finally {
        dispatch(setWithdrawing(false));
    }
};
