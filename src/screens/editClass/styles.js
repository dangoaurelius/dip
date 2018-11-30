import {
  StyleSheet,
  Platform,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        paddingTop: 25,
      },
      android: {
        paddingTop: 10,
      },
    }),
  },
  titleContainer: {
    width: '100%',
    // alignItems: '',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
    alignSelf: 'center',
    textAlign: 'center',
  },
  textInput: {
    height: 40,
    paddingHorizontal: 10,
    color: 'rgb(51, 51, 51)',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  grayText: {
    color: 'gray',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 25,
  },
  editButtonContainer: {
    width: '60%',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 30,
    backgroundColor: 'lightblue',
    borderRadius: 5,
  },
});

export default styles;
