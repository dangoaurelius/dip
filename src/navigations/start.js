import { Navigation } from 'react-native-navigation';

export default () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: 'VoiceNavigation.AddClass',
    },
  }, {
    appStyle: {
      orientation: 'portrait',
    },
  });
};
