import tts from 'react-native-android-speech';

module.exports = {
  isSpeaking: tts.isSpeaking,
  speak: (text) => {
    tts.speak({
      text,
      language: 'ru',
    }).catch((error) => {
      // Errror Callback
      console.log(error);
    });
  },
};
