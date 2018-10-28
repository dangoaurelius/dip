import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import Voice from 'react-native-voice';
import { Speech } from 'AppUtils';
import { numbers, auditory } from '../../constants';

const microphone = require('../../../assets/microphone.jpg');
const { width, height } = Dimensions.get('window');

let timeout;

export default class App extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  constructor() {
    super();

    this.state = {
      results: [],
      partialResults: [],
      words: []
    }
    
    // Voice.onSpeechStart = this.onSpeechStartHandler.bind(this);
    // Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechEnd = () => {
    const words = this.state.results[0].split(/ |-/);
    this.setState({ words });
    this.getInformation(words)
  }

  isNumber = (item) => {
    const number = numbers[item];
    return number;
  }

  getInformation = (words) => {
    let mainWords = [];
    words.map((item, index) => {
      if (item.slice(0, 8) === "аудитори") {
        mainWords.push({ type: 'auditory', item, index });
      } else if (item === "корпус") {
        mainWords.push({ type: 'housing', item, index });
      } else if (!isNaN(item)) {
        mainWords.push({ type: 'number', item, index });
      } else if (this.isNumber(item)) {
        mainWords.push({ type: 'number', item: this.isNumber(item), index });
      }
    });

    let audit = mainWords.filter(item => item.type === 'auditory');
    if (audit.length > 0 && audit.length < 2) {
    let numbers = 0;
      number = mainWords.filter(item => item.type === 'number');
      if (number.length > 0) {
        if (number.length > 1) {
          auditoryId = audit[0].index;
          let numberId = null;
          number.map((item, index) => {
            numberId = Math.abs(auditoryId - item.index) < numberId ? index : numberId;
          });
          if (auditory[number[numberId].item]) {
            Speech.speak(auditory[number[numberId].item].text)
          } else {
            Speech.speak(`Аудитория ${number[numberId].item} не найдена`);
          }
        } else {
          if (auditory[number[0].item]) {
            Speech.speak(auditory[number[0].item].text)
          } else {
            Speech.speak(`Аудитория ${number[0].item} не найдена`);
          }
        }
      } else {
        Speech.speak('Укажите номер аудитории')
      }
      return;
    } else {
      Speech.speak('Укажите адиторию и номер аудитории, которую вы ищите')
    }    
  }

  onSpeechResults(e) {
    this.setState({
      results: e.value,
    });
    if (Platform.OS === 'ios') {
      this.silentVoiceStop();
    }
  }

  onSpeechPartialResults(e) {
    this.setState({
      partialResults: e.value,
    });
  }

  silentVoiceStop = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      this._stopRecognizing()
    }, 3000);
  }

  _startRecognizing = async (e) => {
    this.setState({
      started: true,
      results: [],
      partialResults: [],
      words: []
    });
    try { 
      await this._stopRecognizing();
      await Voice.start('ru');
    } catch (e) {
      console.error(e);
    }
  }

  _stopRecognizing = async (e) => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const { started } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.viewMicrophoneImage}>
          <TouchableOpacity onPress={() => this.getInformation(["У","меня","вопрос","Я","ищу","10","аудиторию"])} style={styles.touchableOpacityMicrophoneImage}>
          {/* <TouchableOpacity onPress={this._startRecognizing} style={styles.touchableOpacityMicrophoneImage}> */}
            <Image source={microphone} style={styles.microphoneImage} resizeMode="contain" />
          </TouchableOpacity>
        </View>
        <View style={styles.viewText}>
          {
            started &&
            <Text style={styles.textRecognize}>
              Text: {this.state.results[0]}
            </Text>
          }
        </View>
        <View style={styles.viewText}>
          {
            started &&
            <Text style={styles.textRecognize}>
              Text: {this.state.partialResults[0]}
            </Text>
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: 25,
      }
    })
  },
  viewMicrophoneImage: {
    width,
    height: height / 4,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  microphoneImage: {
    height: height / 5,
    width: height / 5,
    ...Platform.select({
      ios: {
        borderRadius: ( height / 5 ) / 2,
      },
      android: {
        borderRadius: height / 5
      }
    })
  },
  touchableOpacityMicrophoneImage: {
    borderWidth: 4,
    height: height / 4,
    width: height / 4,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        borderRadius: ( height / 4 ) / 2,
      },
      android: {
        borderRadius: height / 4
      }
    })
  },
  viewText: {
    width,
    marginTop: 30,
    paddingHorizontal: 20
  },
  textRecognize: {
    fontSize: 20,
    fontWeight: '500'
  },
});
