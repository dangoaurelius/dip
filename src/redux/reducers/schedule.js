import { createReducer } from 'redux-act';
import {
  setSchedule,
  removeSchedule,
} from '../actions';

const initialState = { };

const scheduleReducer = createReducer({
  [setSchedule]: (state, payload) => {
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
  [removeSchedule]: (state, payload) => {
    const { day, classValue } = payload;
    if (state[day]) {
      const newState = { ...state };
      delete newState[day][classValue];
      return newState;
    }
    return state;
  },
}, initialState);

export default scheduleReducer;
