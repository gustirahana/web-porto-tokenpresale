import Network from '../../utils/Network';
import {
    setTopupAddress,
    setFetchingAddress,
    setConfirming,
    setDepositError,
    setDepositSuccess,
} from './slice';

export const fetchDepositAddress = () => async (dispatch: any) => {
    dispatch(setFetchingAddress(true));
    dispatch(setDepositError(null));
    try {
        const response = await Network.get('wallet/deposit/address');
        const address = response?.data?.address || '';
        dispatch(setTopupAddress(address));
        return address;
    } catch (error: any) {
        const message = error?.response?.data?.message || error?.message || 'Failed to fetch deposit address';
        dispatch(setDepositError(message));
        throw message;
    } finally {
        dispatch(setFetchingAddress(false));
    }
};

export const confirmDeposit = (txHash: string) => async (dispatch: any) => {
    dispatch(setConfirming(true));
    dispatch(setDepositError(null));
    dispatch(setDepositSuccess(null));
    try {
        const userId = localStorage.getItem('user');
        if (!userId) {
            throw new Error('User ID not found');
        }

        const response = await Network.post(`/users/${userId}/topup-wallet`, { txHash });
        const message = response?.data?.message || 'Deposit confirmation sent.';
        dispatch(setDepositSuccess(message));
        return response?.data;
    } catch (error: any) {
        const message = error?.response?.data?.message || error?.message || 'Failed to confirm deposit';
        dispatch(setDepositError(message));
        throw message;
    } finally {
        dispatch(setConfirming(false));
    }
};

