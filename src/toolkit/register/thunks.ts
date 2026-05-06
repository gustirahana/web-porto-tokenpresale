import Network from '../../utils/Network';
import { setRegisterError, setRegisterLoading, setRegisterSuccess } from './slice';

export interface RegisterPayload {
    username: string;
    firstName: string;
    password: string;
    email: string;
    confirmPassword: string;
    referral?: string;
}

export const registerUser = (payload: RegisterPayload) => async (dispatch: any) => {
    dispatch(setRegisterLoading(true));
    dispatch(setRegisterError(null));
    dispatch(setRegisterSuccess(false));

    try {
        const { referral, ...restPayload } = payload;
        const requestPayload: any = {
            ...restPayload,
            platform: 'web'
        };
        
        // Only include referral if it's not empty
        if (referral && referral.trim() !== '') {
            requestPayload.referral = referral;
        }

        const response = await Network.post('auth/signup', requestPayload);
        dispatch(setRegisterSuccess(true));
        return response?.data;
    } catch (error: any) {
        const message = error?.response?.data?.message || error?.message || 'Registration failed';
        dispatch(setRegisterError(message));
        throw message;
    } finally {
        dispatch(setRegisterLoading(false));
    }
};

