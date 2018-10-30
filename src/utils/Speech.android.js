import tts from 'react-native-android-speech';

module.exports = {
  speak: (text) => {
    tts.speak({
      text,
      language: 'ru',
      // pitch:1.5, // Optional Parameter to set the pitch of Speech,
    }).catch((error) => {
      // Errror Callback
      console.log(error);
    });
  },
};
