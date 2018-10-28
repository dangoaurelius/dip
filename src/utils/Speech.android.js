var tts = require('react-native-android-speech')

module.exports = {
  speak: (text) => {
    tts.speak({
      text,
      // pitch:1.5, // Optional Parameter to set the pitch of Speech,
      language : 'ru',
    // }).catch(error=>{
    //     //Errror Callback
    //     console.log(error)
    });
  }
}