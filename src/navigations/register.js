import { Navigation } from 'react-native-navigation';

import MapScreen from '../screens/app';
import AddClassScreen from '../screens/addClass';

export default (store, provider) => {
  // screens
  Navigation.registerComponent('VoiceNavigation.Map', () => MapScreen, store, provider);
  Navigation.registerComponent('VoiceNavigation.AddClass', () => AddClassScreen, store, provider);
};
