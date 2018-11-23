import {
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width,
    height,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
  },
  textInput: {
    height: 40,
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
});

export default styles;
