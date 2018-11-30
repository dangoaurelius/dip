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
        paddingTop: 25,
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
  menu: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  menuImage: {
    height: 25,
    width: 25,
  },
  saveButtonContainer: {
    width: '100%',
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    height: 35,
    width: '60%',
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 35,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '500',
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 15,
    paddingVertical: 35,
  },
  classInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 5,
    marginHorizontal: 15,
  },
  modalBody: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 25,
    borderRadius: 3,
  },
  scheduleContainer: {
    flex: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  drawerMenuContainer: {
    marginVertical: 10,
    marginHorizontal: 5,
  },
  scheduleDayContainer: {
    paddingBottom: 15,
    marginBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'lightgray',
  },
  classMainInfoContainer: {
    // alignSelf: 'stre',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  classValueText: {
    fontSize: 14,
    marginRight: 10,
    fontWeight: 'bold',
  },
  gpsIconContainer: {
    marginHorizontal: 10,
  },
  classTimeText: {
    fontSize: 12,
  },
  titleHousingInfoContainer: {
    flex: 1,
    paddingRight: 5,
  },
  classTitleText: {
    fontSize: 14,
  },
  auditoryHousingText: {
    fontSize: 10,
  },
  iconImage: {
    height: 20,
    width: 20,
  },
});

export default styles;
