import { Navigation } from 'react-native-navigation';

export default () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: 'VoiceNavigation.Map',
    },
  }, {
    appStyle: {
      orientation: 'portrait',
    },
  });
};
