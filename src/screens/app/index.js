/* eslint-disable no-underscore-dangle  */
/* eslint-disable no-else-return */
import MapViewDirections from 'react-native-maps-directions';
import React, { Component } from 'react';
import Voice from 'react-native-voice';
import {
  TouchableOpacity,
  Platform,
  Image,
  Text,
  View,
} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

import {
  Speech,
  getGeolocation,
  getInitialRegion,
} from 'AppUtils';

import {
  numbers,
  auditory,
  destinations,
  GOOGLE_API_KEY,
} from '../../constants';

import styles from './styles';

const microphone = require('../../../assets/microphone.jpg');

const isAndroid = Platform.OS === 'android';
const MAP_PROFIDER = isAndroid ? PROVIDER_GOOGLE : undefined;
const origin = { latitude: 37.3318456, longitude: -122.0296002 };
const destination = { latitude: 37.771707, longitude: -122.4053769 };

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
      words: [],
      directionViewState: 0, // 0 - hide, 1 - loding (on geolocaiton retriving), 3 - show web view
    };

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
    this.getInformation(words);
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
      const number = mainWords.filter(item => item.type === 'number');
      if (number.length > 0) {
        if (number.length > 1) {
          const auditoryId = audit[0].index;
          let numberId = null;
          number.map((item, index) => {
            numberId = Math.abs(auditoryId - item.index) < numberId ? index : numberId;
          });
          if (auditory[number[numberId].item]) {
            Speech.speak(auditory[number[numberId].item].text);
          } else {
            Speech.speak(`Аудитория ${number[numberId].item} не найдена`);
          }
        } else {
          if (auditory[number[0].item]) {
            Speech.speak(auditory[number[0].item].text);
            this._onAuditoryRecognised(auditory[number[0].item].housing);
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
      this._stopRecognizing();
    }, 3000);
  }

  _startRecognizing = async (e) => {
    this.setState({
      started: true,
      results: [],
      partialResults: [],
      words: [],
    });
    try {
      await this._stopRecognizing();
      await Voice.start('ru');
    } catch (errorEvent) {
      console.error(errorEvent);
    }
  }

  _stopRecognizing = async (e) => {
    try {
      await Voice.stop();
    } catch (errorEvent) {
      console.error(errorEvent);
    }
  }

  _getCurrentGeolocation = () => {
    getGeolocation(this._onLocationSuccess, this._onLocationError);
  }

  _onAuditoryRecognised = (auditoryNumber) => {
    const { housingDestination } = destinations[auditoryNumber];
    this.setState(
      { housingDestination },
      this._getCurrentGeolocation,
    );
  }

  _onLocationSuccess = ({ coords }) => {
    const { housingDestination } = this.state;
    const initialRegion = getInitialRegion(coords);
    this.setState({
      initialRegion,
      userCoords: coords,
    });
  }

  _onLocationError = (error) => {
    if (error.code === 3) { // if timed out({app_folder}->src->constants.geolocationParams.timeout) then start again.
      this._getCurrentGeolocation();
    }
  }

  renderMapView = () => {
    const { initialRegion, userCoords } = this.state;

    return (
      <View style={styles.mapContainer}>
        <MapView
          provider={MAP_PROFIDER}
          style={styles.map}
          initialRegion={initialRegion}
        >
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={GOOGLE_API_KEY}
            />
            <Marker
              coordinate={userCoords}
              title={'User Marker'}
              description={'Description'}
            />
          </MapView>
      </View>
    );
  }

  render() {
    const { started, userCoords } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.viewMicrophoneImage}>
          <TouchableOpacity onPress={() => this.getInformation(['У', 'меня', 'вопрос', 'Я', 'ищу', '10', 'аудиторию'])} style={styles.touchableOpacityMicrophoneImage}>
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
        {userCoords && (this.renderMapView())}
      </View>
    );
  }
}
