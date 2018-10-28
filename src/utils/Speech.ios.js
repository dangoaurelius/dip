import Speech from 'react-native-speech';


module.exports = {
  speak: (text) => {
    Speech.speak({
      text,
      voice: 'ru',
    });
  }
}