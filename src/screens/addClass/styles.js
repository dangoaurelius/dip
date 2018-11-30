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
    paddingVertical: 10,
    color: 'rgb(80, 80, 80)',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  addButtonContainer: {
    width: '60%',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 30,
    backgroundColor: 'lightblue',
    borderRadius: 5,
  },
  rowContainer: {
    alignSelf: 'stretch',
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 25,
  },
  dropdown: {
    alignSelf: 'stretch',
    paddingVertical: 5,
    paddingLeft: 15,
  },
});

export default styles;
