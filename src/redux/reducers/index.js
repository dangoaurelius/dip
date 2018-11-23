import { combineReducers } from 'redux';
import schedule from './schedule';
import edit from './edit';

const reducer = combineReducers({
  schedule,
  edit,
});

export default reducer;
