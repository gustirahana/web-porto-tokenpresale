import { setBuying, setBuyTokenError, setBuyTokenSuccess } from './slice';
import Network from '../../utils/Network';

export interface BuyTokenPayload {
    amount: number;
    price: number;
    batch: number;
}

export const buyTokens = (payload: BuyTokenPayload) => async (dispatch: any) => {
    dispatch(setBuying(true));
    dispatch(setBuyTokenError(null));
    dispatch(setBuyTokenSuccess(null));

    try {
        const userId = localStorage.getItem('user');
        if (!userId) {
            throw new Error('User ID not found');
        }

        const response = await Network.post(`/users/${userId}/buy-token`, payload);
        dispatch(setBuyTokenSuccess('Tokens purchased successfully'));
        return response.data || response;
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to buy tokens';
        dispatch(setBuyTokenError(errorMessage));
        throw error;
    } finally {
        dispatch(setBuying(false));
    }
};

