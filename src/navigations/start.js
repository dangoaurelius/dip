import { Navigation } from 'react-native-navigation';

export default () => {
  Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
      root: {
        component: {
          name: 'VoiceNavigation.Map',
        },
      },
    });
  });
};
