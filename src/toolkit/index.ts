import {
  combineReducers,
} from '@reduxjs/toolkit';

import ThemeSlice from './themeLayouts/reducer';

//auth
import authReducer from './auth/slice';

import withdrawalReducer from './withdrawal/slice';
import depositReducer from './deposit/slice';
import transactionHistoryReducer from './transactionHistory/slice';
import settingsReducer from './settings/slice';
import registerReducer from './register/slice';
import profileReducer from './profile/slice';
import presaleReducer from './presale/slice';
import buyTokenReducer from './buyToken/slice';

// Combine your reducers into a root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  registration: registerReducer,
  withdrawal: withdrawalReducer,
  deposit: depositReducer,
  transactionHistory: transactionHistoryReducer,
  settings: settingsReducer,
  profile: profileReducer,
  presale: presaleReducer,
  buyToken: buyTokenReducer,
  Theme: ThemeSlice
});

export {
  rootReducer
}