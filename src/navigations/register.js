import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import MapScreen from '../screens/app';
import AddClassScreen from '../screens/addClass';
import EditClassScreen from '../screens/editClass';

export default (store) => {
  // screens
  Navigation.registerComponent('VoiceNavigation.Map', () => MapScreen, store, Provider);
  Navigation.registerComponent('VoiceNavigation.AddClass', () => AddClassScreen, store, Provider);
  Navigation.registerComponent('VoiceNavigation.EditClass', () => EditClassScreen, store, Provider);
};
