/* eslint-disable no-underscore-dangle  */
/* eslint-disable no-else-return */
import MapViewDirections from 'react-native-maps-directions';
import React, { Component } from 'react';
import Voice from 'react-native-voice';
import moment from 'moment';
import {
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
  Image,
  Text,
  View,
} from 'react-native';
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

import {
  Speech,
  getInitialRegion,
  getCurrentDayName,
  setScheduleForToday,
  getScheduleForToday,
  subscribeGeolocation,
  testPointWithLocation,
  unsubscribeGeolocation,
  checkGeolocationPermission,
} from 'AppUtils';

import {
  FLOORS,
  numbers,
  auditory,
  ZNTU_COORDS,
  destinations,
  MAP_SETTINGS,
  GOOGLE_API_KEY,
  HOUSINGS_TEXT,
  DIRECTION_LINE_COLOR,
  opacityInterpolation,
  translateYInterpolation,
} from '../../constants';

import styles from './styles';

const microphone = require('../../../assets/microphone.jpg');
const menu = require('../../../assets/menu.png');

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
      modalShow: false,
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

  async componentWillMount() {
    try {
      const schedule = await getScheduleForToday();
      if (schedule) {
        this.setState({
          schedule,
          showScreen: true,
        });
      }
      console.warn('schedule', schedule);
    } catch (error) {
      alert('Error read data from storage.');
      console.warn(error);
    }
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

  toggleModal = () => {
    const { modalShow } = this.state;
    this.setState({ modalShow: !modalShow });
  }

  onMenuPress = () => {
    //
    this.toggleModal();
    // setScheduleForToday({
    //   1: {
    //     title: 'odin',
    //     class: 125,
    //     timeStart: moment(),
    //     timeOver: moment(),
    //   },
    //   2: {
    //     title: 'dva',
    //     class: 20,
    //     timeStart: moment(),
    //     timeOver: moment(),
    //   },
    //   3: {
    //     title: 'tri',
    //     class: 520,
    //     timeStart: moment(),
    //     timeOver: moment(),
    //   },
    //   4: {
    //     title: 'chetire',
    //     class: 529,
    //     timeStart: moment(),
    //     timeOver: moment(),
    //   },
    //   5: {
    //     title: 'piat',
    //     class: 498,
    //     timeStart: moment(),
    //     timeOver: moment(),
    //   },
    // });
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
          this._onAuditoryRecognised(auditory[number[0].item].housing, number[0].item);
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

  _onAuditoryRecognised = (housingNumber, auditoryNumber) => {
    const { address, coordinates: { entry } } = destinations[housingNumber];
    this.setState(
      {
        auditoryNumber,
        housingNumber,
        destinationObject: destinations[housingNumber],
        housingDestination: address,
        housingCoordinates: entry,
        directionViewState: 1,
      },
      this._getCurrentGeolocation,
    );
  }

  _alreadyInHousingVoice = async (housingNumber, auditoryNumber) => {
    try {
      const isSpeaking = await Speech.isSpeaking();
      if (isSpeaking) {
        this._alreadyInHousingVoice(housingNumber, auditoryNumber);
      } else {
        const { floor } = auditory[auditoryNumber];
        const inviteText = floor === 1 ? 'Пройдите' : 'Поднимитесь';
        Speech.speak(`Вы уже в ${HOUSINGS_TEXT[housingNumber]} корпусе. ${inviteText} на ${FLOORS[floor]} этаж.`);
      }
    } catch (error) {
      this._alreadyInHousingVoice(housingNumber, auditoryNumber);
    }
  }

  _onLocationSuccess = ({ coords }) => {
    const { housingDestination, housingNumber, auditoryNumber } = this.state;
    const initialRegion = getInitialRegion(coords);
    const isUserInZNTUTerritory = testPointWithLocation(coords, ZNTU_TERRITORY_COORDS);
    let inHousing = null;

    const hTerritory = destinations[housingNumber].territory;
    hTerritory.forEach(async (coordsItem) => {
      if (testPointWithLocation(coords, coordsItem)) {
        inHousing = housingNumber;
        if (!this.firstTime) {
          this._alreadyInHousingVoice(housingNumber, auditoryNumber);
          this.firstTime = true;
        }
      }
    });

    this.setState({
      inHousing,
      initialRegion,
      housingDestination,
      userCoords: coords,
      directionViewState: 2,
      isUserInZNTUTerritory,
    });
  }

  _onLocationError = ({ code }) => {
    switch (code) {
      case 2:
        alert('Enable geolocaiton please!');
        break;
      case 3: // if timed out({app_folder}->src->constants.geolocationParams.timeout) then start again.
        this._getCurrentGeolocation();
        console.log('[GEO] Timeout exceeded. Trying again...');
        break;
      default:
        console.warn('[GEO] Error on geolocation request. Code ', code);
        break;
    }
  }

  _closeMap = () => {
    this.firstTime = false;
    this.setState({
      userCoords: null,
      initialRegion: null,
      currentHousing: null,
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

    const attributesViewArray = [
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
      inHousing,
      userCoords,
      initialRegion,
      directionViewState,
    } = this.state;

    return (
      <View style={styles.mapContainer}>
        {directionViewState === 2
          ? (
          <MapView
            style={styles.map}
            provider={MAP_PROFIDER}
            initialRegion={initialRegion}
          >
            <Marker
              key={'key-user-marker'}
              title={'Вы здесь'}
              coordinate={userCoords}
              description={'Ваше текущее местоположение.'}
            />
            {!inHousing && this._renderMapViewAttributes()}
          </MapView>
          )
          : (<ActivityIndicator size={'large'} />)
        }
      </View>
    );
  }

  _renderText = text => (<Text style={styles.textRecognize}>Text: {text}</Text>);

  __debugOnClick = () => {
    this._closeMap();
    this.getInformation(['У', 'меня', 'вопрос', 'Я', 'ищу', '320', 'аудиторию']); // 164 , 320
  };

  _renderScheduleClass = (item, index) => {
    const { timeStart, timeOver, title } = item;
    return (
      <View key={`key-index-${index}`} style={styles.classInfoContainer}>
        <Text style={{ width: '15%', fontSize: 10, }}>
          {item.class}
        </Text>
        <Text style={{ flex: 1, fontSize: 10, }}>
          {title}
        </Text>
        <Text style={{ width: '20%', fontSize: 10, }}>
          {moment(timeStart).format('h:mm')}
        </Text>
        <Text style={{ width: '20%', fontSize: 10, }}>
          {moment(timeOver).format('h:mm')}
        </Text>
        <Text
          onPress={() => this.onPressGPS(auditory[item.class].housing, item.class)}
          style={{ width: '20%', fontSize: 10, }}
        >
          Маршрут
        </Text>
      </View>
    );
  }

  _renderScheduleModal = () => {
    const { schedule } = this.state;
    if (schedule) {
      const tmp = Object.entries(schedule);
      return (
        <View style={styles.modalContainer}>
          <View style={styles.modalBody}>
            <View style={styles.titleContainer}>
              <Text>Расписание на {getCurrentDayName()}</Text>
            </View>
            <View style={styles.scheduleContainer}>
              <ScrollView>
                <View style={styles.classInfoContainer}>
                  <Text style={{ width: '15%', fontSize: 12, }}>
                    Ауд.
                  </Text>
                  <Text style={{ flex: 1, fontSize: 12, }}>
                    Название
                  </Text>
                  <Text style={{ width: '20%', fontSize: 12, }}>
                    Начало
                  </Text>
                  <Text style={{ width: '20%', fontSize: 12, }}>
                    Конец
                  </Text>
                  <Text style={{ width: '20%', fontSize: 12, }}>
                    Геолок.
                  </Text>
                </View>
                {tmp.map((item, index) => (this._renderScheduleClass(item[1], index)))}
              </ScrollView>
            </View>
            <View style={styles.saveButtonContainer}>
              <TouchableOpacity onPress={this.toggleModal}>
                <View style={styles.saveButton}>
                  <Text>
                    Закрить
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
    return null;
  }

  onPressGPS = (housing, className) => {
    this.setState(
      { modalShow: false },
      () => this._onAuditoryRecognised(housing, className),
    );
  }

  render() {
    const { modalShow, started, directionViewState } = this.state;

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
        <View style={styles.menu}>
          <TouchableOpacity onPress={this.onMenuPress}>
            <Image
              source={menu}
              style={styles.menuImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.viewText}>
          {started && this._renderText(this.state.results[0])}
        </View>
        <View style={styles.viewText}>
          {started && this._renderText(this.state.partialResults[0])}
        </View>
        {(directionViewState !== 0) && this._renderMapView()}
        {modalShow && this._renderScheduleModal()}
      </View>
    );
  }
}
