import { AsyncStorage } from 'react-native';
import moment from 'moment';

const days = {
  1: 'Понедельник',
  2: 'Вторник',
  3: 'Среда',
  4: 'Четверг',
  5: 'Пятница',
  6: 'Суббота',
  7: 'Воскресенье',
};

export const setSchedule = async (scheduleObject) => {
  try {
    await AsyncStorage.setItem('voiceNavigation@schedule', JSON.stringify(scheduleObject));
    return true;
  } catch (error) {
    // Error saving data
    console.warn(error);
    return false;
  }
};

export const getSchedule = async () => {
  try {
    const value = await AsyncStorage.getItem('voiceNavigation@schedule');
    console.warn(value);
    return JSON.parse(value);
  } catch (error) {
    // Error retrieving data
    console.warn(error);
    return null;
  }
};

export const getCurrentDay = () => (moment().isoWeekday());

export const getCurrentDayName = () => (days[getCurrentDay()]);

export const getScheduleForToday = async () => {
  const currentDay = getCurrentDay();
  const schedule = await getSchedule();
  if (schedule) {
    return schedule[currentDay];
  }
  return null;
};

export const setScheduleForToday = async (newSchedule) => {
  const currentDay = getCurrentDay();
  console.warn('currentDay', currentDay);
  try {
    const schedule = await getSchedule();
    let currentSchedule = {};
    if (schedule) {
      currentSchedule = { ...schedule };
    }
    currentSchedule[currentDay] = newSchedule;
    await setSchedule(currentSchedule);
    console.warn(currentDay, schedule, currentSchedule);
  } catch (error) {
    console.warn(error);
  }
};
