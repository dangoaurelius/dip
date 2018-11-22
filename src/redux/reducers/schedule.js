import { createReducer } from 'redux-act';
import {
  setSchedule,
  editSchedule,
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
      return {
        ...state,
        [day]: {
          ...state[day],
          day: null,
        }
      };
    }
  }
}, initialState);

export default scheduleReducer;
