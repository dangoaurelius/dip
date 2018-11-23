import { createReducer } from 'redux-act';
import {
  setEditSchedule,
} from '../actions';

const initialState = { };

const scheduleReducer = createReducer({
  [setEditSchedule]: (state, payload) => {
    const { day, classValue } = payload;
    let newDay = {};
    if (state[day]) {
      newDay = {
        ...state[day],
        [classValue]: payload,
      };
    } else {
      newDay[classValue] = payload;
    }

    return ({
      ...state,
      [day]: newDay,
    });
  },
}, initialState);

export default scheduleReducer;
