import {
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: 25,
      },
    }),
  },
  viewMicrophoneImage: {
    width,
    height: height / 4,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  microphoneImage: {
    height: height / 5,
    width: height / 5,
    ...Platform.select({
      ios: {
        borderRadius: (height / 5) / 2,
      },
      android: {
        borderRadius: height / 5,
      },
    }),
  },
  touchableOpacityMicrophoneImage: {
    borderWidth: 4,
    height: height / 4,
    width: height / 4,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        borderRadius: (height / 4) / 2,
      },
      android: {
        borderRadius: height / 4,
      },
    }),
  },
  viewText: {
    width,
    marginTop: 30,
    paddingHorizontal: 20,
  },
  textRecognize: {
    fontSize: 20,
    fontWeight: '500',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default styles;
