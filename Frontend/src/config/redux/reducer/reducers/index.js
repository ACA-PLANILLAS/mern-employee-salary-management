import { combineReducers } from 'redux';
import authReducer from '../authReducer/index';
import dataGajiReducer from '../dataGajiReducer/index';

const rootReducer = combineReducers({
  auth: authReducer,
  dataGaji: dataGajiReducer,
});

export default rootReducer;
