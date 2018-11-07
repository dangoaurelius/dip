/* eslint-disable no-underscore-dangle  */
/* eslint-disable no-else-return */
import MapViewDirections from 'react-native-maps-directions';
import React, { Component } from 'react';
import Voice from 'react-native-voice';
import {
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Platform,
  Image,
  Text,
  View,
} from 'react-native';
import MapView, {
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

import {
  Speech,
  getInitialRegion,
  subscribeGeolocation,
  testPointWithLocation,
  unsubscribeGeolocation,
  checkGeolocationPermission,
} from 'AppUtils';

import {
  numbers,
  auditory,
  ZNTU_COORDS,
  destinations,
  MAP_SETTINGS,
  GOOGLE_API_KEY,
  POLIGONE_FILL_COLOR,
  DIRECTION_LINE_COLOR,
  opacityInterpolation,
  translateYInterpolation,
} from '../../constants';

import styles from './styles';

const microphone = require('../../../assets/microphone.jpg');

const isAndroid = Platform.OS === 'android';
const MAP_PROFIDER = isAndroid ? PROVIDER_GOOGLE : undefined;
const ZNTU_TERRITORY_COORDS = [
  ZNTU_COORDS.territoryCoords.topLeft,
  ZNTU_COORDS.territoryCoords.bottomLeft,
  ZNTU_COORDS.territoryCoords.bottomRight,
  ZNTU_COORDS.territoryCoords.topRight,
];

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
      isUserInZNTUTerritory: false,
      animation: new Animated.Value(0),
    };

    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
  }

  componentWillUnmount() {
    unsubscribeGeolocation();
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
    const mainWords = [];
    words.forEach((item, index) => {
      if (item.slice(0, 8) === 'аудитори') {
        mainWords.push({
          type: 'auditory',
          item,
          index,
        });
      } else if (item === 'корпус') {
        mainWords.push({
          type: 'housing',
          item,
          index,
        });
      } else if (!isNaN(item)) {
        mainWords.push({
          type: 'number',
          item,
          index,
        });
      } else if (this.isNumber(item)) {
        mainWords.push({
          type: 'number',
          item: this.isNumber(item),
          index,
        });
      }
    });

    const audit = mainWords.filter(item => item.type === 'auditory');

    if (audit.length > 0 && audit.length < 2) {
      const number = mainWords.filter(item => (item.type === 'number'));
      if (number.length > 0) {
        if (number.length > 1) {
          const auditoryId = audit[0].index;
          let numberId = null;
          number.forEach((item, index) => {
            numberId = Math.abs(auditoryId - item.index) < numberId ? index : numberId;
          });

          if (auditory[number[numberId].item]) {
            Speech.speak(auditory[number[numberId].item].text);
          } else {
            Speech.speak(`Аудитория ${number[numberId].item} не найдена`);
          }
        } else if (auditory[number[0].item]) {
          Speech.speak(auditory[number[0].item].text);
          this._onAuditoryRecognised(auditory[number[0].item].housing);
        } else {
          Speech.speak(`Аудитория ${number[0].item} не найдена`);
        }
      } else {
        Speech.speak('Укажите номер аудитории');
      }
    } else {
      Speech.speak('Укажите адиторию и номер аудитории, которую вы ищите');
    }
  }

  onSpeechResults(e) {
    this.setState({ results: e.value });

    if (Platform.OS === 'ios') {
      this.silentVoiceStop();
    }
  }

  onSpeechPartialResults(e) {
    this.setState({ partialResults: e.value });
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
    const permission = checkGeolocationPermission();
    if (permission) {
      subscribeGeolocation(this._onLocationSuccess, this._onLocationError);
    }
  }

  _onAuditoryRecognised = (auditoryNumber) => {
    const { address, coordinates: { entry } } = destinations[auditoryNumber];
    this.setState(
      {
        destinationObject: destinations[auditoryNumber],
        housingDestination: address,
        housingCoordinates: entry,
        directionViewState: 1,
      },
      this._getCurrentGeolocation,
    );
  }

  _onLocationSuccess = ({ coords }) => {
    const { housingDestination } = this.state;
    const initialRegion = getInitialRegion(coords);
    console.log('coords', coords);
    const isUserInZNTUTerritory = testPointWithLocation(coords, ZNTU_TERRITORY_COORDS);

    if (isUserInZNTUTerritory) {

    }

    this.setState({
      initialRegion,
      housingDestination,
      userCoords: coords,
      directionViewState: 2,
      isUserInZNTUTerritory,
    });
  }

  _onLocationError = (error) => {
    if (error.code === 3) { // if timed out({app_folder}->src->constants.geolocationParams.timeout) then start again.
      this._getCurrentGeolocation();
      console.log('[GEO] Timeout exceeded. Trying again...');
    } else {
      console.warn('[GEO] Error on geolocation request.', error);
    }
  }

  _closeMap = () => {
    this.setState({
      userCoords: null,
      initialRegion: null,
      housingDestination: null,
      destinationObject: null,
      directionViewState: 0,
      isUserInZNTUTerritory: false,
    });
  }

  _getAnimatedStyle = () => {
    const { directionViewState, animation } = this.state;
    // Loading state
    if (directionViewState === 1) {
      return {
        opacity: animation.interpolate(opacityInterpolation),
      };
    } else {
      return {
        transform: [
          { TranslateY: animation.interpolate(translateYInterpolation) },
        ],
      };
    }
  }

  _renderMapViewAttributes = () => {
    const {
      userCoords,
      destinationObject,
      isUserInZNTUTerritory,
    } = this.state;
    const { mode } = MAP_SETTINGS;
    const { entryPointCoord, entryPointCoordHousing4 } = ZNTU_COORDS;
    const {
      id,
      coordinates: {
        entry,
        exit,
      },
    } = destinationObject;
    const housingOneEntryCoords = destinations['1'].coordinates.entry;
    const housingOneExitCoords = destinations['1'].coordinates.exit;
    console.log('_renderMapViewAttributes');
    const attributesViewArray = [
      <Marker
        key={'key-user-marker'}
        title={'Вы здесь'}
        coordinate={userCoords}
        description={'Ваше текущее местоположение.'}
      />,
      <Marker
        key={'key-destination-marker'}
        title={'Идти сюда'}
        coordinate={entry}
        description={'Местоположение цели.'}
      />,
    ];

    if (id === 4) {
      if (isUserInZNTUTerritory) {
        attributesViewArray.push([
          <Polyline
            key={'key-4'}
            coordinates={[
              userCoords,
              housingOneExitCoords,
              housingOneEntryCoords,
              entryPointCoord,
              {
                latitude: 47.816615,
                longitude: 35.184674,
              },
              entryPointCoordHousing4,
              entry,
            ]}
          />,
        ]);
      } else {
        attributesViewArray.push([
          <MapViewDirections
            key={'key-MapViewDirections'}
            mode={mode}
            strokeWidth={3}
            origin={userCoords}
            resetOnChange={false}
            apikey={GOOGLE_API_KEY}
            destination={entryPointCoordHousing4}
            strokeColor={DIRECTION_LINE_COLOR}
          />,
          <Polyline
            key={'key-4'}
            strokeWidth={3}
            strokeColor={DIRECTION_LINE_COLOR}
            coordinates={[
              entryPointCoordHousing4,
              entry,
            ]}
          />,
        ]);
      }
    } else if (id === 2) {
      if (isUserInZNTUTerritory) {
        attributesViewArray.push([
          <Polyline
            key={'key2'}
            strokeWidth={3}
            strokeColor={DIRECTION_LINE_COLOR}
            coordinates={[
              userCoords,
              housingOneExitCoords,
              housingOneEntryCoords,
              entryPointCoord,
            ]}
          />,
          <MapViewDirections
            key={'key1'}
            mode={mode}
            strokeWidth={3}
            origin={entryPointCoord}
            resetOnChange={false}
            apikey={GOOGLE_API_KEY}
            destination={entry}
            strokeColor={DIRECTION_LINE_COLOR}
          />,
        ]);
      } else {
        attributesViewArray.push(
          <MapViewDirections
            key={'key1'}
            mode={mode}
            strokeWidth={3}
            origin={userCoords}
            resetOnChange={false}
            apikey={GOOGLE_API_KEY}
            destination={entry}
            strokeColor={DIRECTION_LINE_COLOR}
          />,
        );
      }
    } else if (id === 1) {
      if (isUserInZNTUTerritory) {
        attributesViewArray.push([
          <Polyline
            key={'key2'}
            strokeWidth={3}
            strokeColor={DIRECTION_LINE_COLOR}
            coordinates={[
              userCoords,
              housingOneExitCoords,
            ]}
          />,
        ]);
      } else {
        attributesViewArray.push([
          <MapViewDirections
            key={'key1'}
            mode={mode}
            strokeWidth={3}
            origin={userCoords}
            resetOnChange={false}
            apikey={GOOGLE_API_KEY}
            destination={entryPointCoord}
            strokeColor={DIRECTION_LINE_COLOR}
          />,
          <Polyline
            key={'key2'}
            strokeWidth={3}
            strokeColor={DIRECTION_LINE_COLOR}
            coordinates={[
              entryPointCoord,
              housingOneEntryCoords,
            ]}
          />,
        ]);
      }
    } else {
      if (isUserInZNTUTerritory) {
        attributesViewArray.push([
          <Polyline
            key={'key2'}
            strokeWidth={3}
            strokeColor={DIRECTION_LINE_COLOR}
            coordinates={[
              userCoords,
              entry,
            ]}
          />,
        ]);
      } else {
        attributesViewArray.push([
          <MapViewDirections
            key={'key1'}
            mode={mode}
            strokeWidth={3}
            origin={userCoords}
            resetOnChange={false}
            apikey={GOOGLE_API_KEY}
            destination={entryPointCoord}
            strokeColor={DIRECTION_LINE_COLOR}
          />,
          <Polyline
            key={'key2'}
            strokeWidth={3}
            strokeColor={DIRECTION_LINE_COLOR}
            coordinates={[
              entryPointCoord,
              housingOneEntryCoords,
              housingOneExitCoords,
              entry,
            ]}
          />,
        ]);
      }
    }

    return attributesViewArray;
  }

  _renderMapView = () => {
    const {
      initialRegion,
      directionViewState,
    } = this.state;

    console.log('render map view');
    return (
      <View style={styles.mapContainer}>
        {directionViewState === 2
          ? (
          <MapView
            style={styles.map}
            provider={MAP_PROFIDER}
            initialRegion={initialRegion}
          >
            {this._renderMapViewAttributes()}
          </MapView>
          )
          : (<ActivityIndicator size={'large'} />)
        }
      </View>
    );
  }

  _renderText = text => (<Text style={styles.textRecognize}>Text: {text}</Text>);

  __debugOnClick = () => this.getInformation(['У', 'меня', 'вопрос', 'Я', 'ищу', '524', 'аудиторию']);

  render() {
    const { started, directionViewState } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.viewMicrophoneImage}>
          {/* <TouchableOpacity onPress={this._startRecognizing} style={styles.touchableOpacityMicrophoneImage}> */}
          <TouchableOpacity
            onPress={this.__debugOnClick}
            style={styles.touchableOpacityMicrophoneImage}
          >
            <Image source={microphone} style={styles.microphoneImage} resizeMode="contain" />
          </TouchableOpacity>
        </View>
        <View style={styles.viewText}>
          {started && this._renderText(this.state.results[0])}
        </View>
        <View style={styles.viewText}>
          {started && this._renderText(this.state.partialResults[0])}
        </View>
        {(directionViewState !== 0) && this._renderMapView()}
      </View>
    );
  }
}
