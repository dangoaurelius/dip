import Speech from 'react-native-speech';

module.exports = {
  isSpeaking: Speech.isSpeaking,
  speak: (text) => {
    Speech.speak({
      text,
      voice: 'ru',
    });
  },
};
