import { Navigation } from 'react-native-navigation';

import App from '../screens/app';

export default (store) => {
  // screens
  Navigation.registerComponent('VoiceNavigation.App', () => App);
};
