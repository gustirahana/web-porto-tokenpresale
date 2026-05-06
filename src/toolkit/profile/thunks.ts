import { setLoading, setError, setProfile, setBalanceLoading, setBalanceError, setBalance, setPinBalance } from './slice';
import Network from '../../utils/Network';

export const fetchProfile = () => async (dispatch: any) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
        const userId = localStorage.getItem('user');
        if (!userId) {
            throw new Error('User ID not found');
        }

        const response = await Network.get(`/users/${userId}/profile`);
        dispatch(setProfile(response.data || response));
        return response.data || response;
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch profile';
        dispatch(setError(errorMessage));
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

export const fetchBalance = () => async (dispatch: any) => {
    dispatch(setBalanceLoading(true));
    dispatch(setBalanceError(null));

    try {
        const userId = localStorage.getItem('user');
        if (!userId) {
            throw new Error('User ID not found');
        }

        const response = await Network.get(`/users/${userId}/balance`);
        const responseData = response.data || response;

        // Extract balance (SP ADST) -> mapped to `balance` or `saldo` in API
        let rawBalance = responseData?.balance;
        if (typeof rawBalance === 'object' && rawBalance !== null) {
            rawBalance = rawBalance.balance;
        }
        const finalBalance = rawBalance ?? responseData?.saldo ?? 0;
        const balanceValue = typeof finalBalance === 'number' ? finalBalance : parseFloat(finalBalance) || 0;
        dispatch(setBalance(balanceValue));

        // Extract pinBalance (SOL)
        let rawPinBalance = responseData?.pinBalance;
        if (typeof responseData?.balance === 'object' && responseData?.balance !== null && 'pinBalance' in responseData.balance) {
            rawPinBalance = responseData.balance.pinBalance;
        }
        const pinBalanceValue = typeof rawPinBalance === 'number' ? rawPinBalance : (rawPinBalance ? parseFloat(rawPinBalance) : 0);
        dispatch(setPinBalance(pinBalanceValue));

        return responseData;
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch balance';
        dispatch(setBalanceError(errorMessage));
        throw error;
    } finally {
        dispatch(setBalanceLoading(false));
    }
};

