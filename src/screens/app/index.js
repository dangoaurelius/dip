/* eslint-disable no-underscore-dangle  */
/* eslint-disable no-else-return */
import MapViewDirections from 'react-native-maps-directions';
import { Navigation } from 'react-native-navigation';
import Drawer from 'react-native-drawer';
import React, { Component } from 'react';
import Voice from 'react-native-voice';
import { connect } from 'react-redux';
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
} from '../../constants';

import DrawerComponent from './drawer';

import { removeSchedule, setEditSchedule } from '../../redux/actions';

import styles from './styles';

const walk = require('../../../assets/walk.png');
const remove = require('../../../assets/delete.png');
const menu = require('../../../assets/menu.png');
const microphone = require('../../../assets/microphone.jpg');

const isAndroid = Platform.OS === 'android';
const MAP_PROFIDER = isAndroid ? PROVIDER_GOOGLE : undefined;
const ZNTU_TERRITORY_COORDS = [
  ZNTU_COORDS.territoryCoords.topLeft,
  ZNTU_COORDS.territoryCoords.bottomLeft,
  ZNTU_COORDS.territoryCoords.bottomRight,
  ZNTU_COORDS.territoryCoords.topRight,
];

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
  main: { paddingLeft: 3 },
};

let timeout;

@connect(state => ({ schedule: state.schedule }), {
  removeScheduleAction: removeSchedule,
  setEditScheduleAction: setEditSchedule,
})
class App extends Component {
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

  onPressAddClass = () => {
    const { navigator } = this.props;
    navigator.push({ screen: 'VoiceNavigation.AddClass' });
  }

  onMenuPress = () => {
    // const { navigator } = this.props;
    // navigator.push({ screen: 'VoiceNavigation.AddClass' });
    this.toggleModal();
    // this._drawer.open();
  }

  onPressEdit = (item) => {
    const {
      navigator,
      setEditScheduleAction,
    } = this.props;
    setEditScheduleAction(item);
    navigator.push({ screen: 'VoiceNavigation.EditClass' });
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

  _getTimeForClass = (classValue) => {
    switch (classValue) {
      case 2:
        return ({ timeStart: '10:05', timeOver: '11:25' });
      case 3:
        return ({ timeStart: '11:55', timeOver: '13:15' });
      case 4:
        return ({ timeStart: '13:25', timeOver: '14:45' });
      case 5:
        return ({ timeStart: '14:55', timeOver: '16:15' });
      case 6:
      return ({ timeStart: '16:25', timeOver: '17:45' });
      case 1:
      default:
       return ({ timeStart: '8:30', timeOver: '9:50' });
    }
  }

  _onPressRemove = (day, classValue) => {
    const { removeScheduleAction } = this.props;
    removeScheduleAction({ day, classValue });
  }

  _renderScheduleClass = (item, index) => {
    const {
      day,
      title,
      classValue,
    } = item;

    const timeData = this._getTimeForClass(classValue);
    return (
      <View
        key={`key-index-${index}`}
        style={styles.classInfoContainer}
      >
        <TouchableOpacity
          onPress={() => this.onPressEdit(item)}
          style={{ flex: 1, flexDirection: 'row' }}
        >
          <Text style={{ width: 30, fontSize: 10 }}>
            {classValue}
          </Text>
          <Text style={{ flex: 1, fontSize: 10 }}>
            {title} {item.auditory}
          </Text>
          <Text style={{ fontSize: 10 }}>
            {timeData.timeStart}-{timeData.timeOver}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.onPressGPS(auditory[classValue].housing, classValue)}>
          <Image
            source={walk}
            resizeMode={'contain'}
            style={{ height: 20, width: 20 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this._onPressRemove(day, classValue)}>
          <Image
            source={remove}
            resizeMode={'contain'}
            style={{ height: 20, width: 20 }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  _renderScheduleModal = () => {
    const { schedule } = this.props;
    if (schedule) {
      const scheduleForToday = schedule[moment().isoWeekday()];
      return (
        <View style={styles.modalContainer}>
          <View style={styles.modalBody}>
            <View style={styles.titleContainer}>
              <Text>Расписание на {getCurrentDayName()}</Text>
            </View>
            <View style={styles.scheduleContainer}>
              <ScrollView>
                {scheduleForToday
                  && Object.entries(scheduleForToday).map((item, index) => (this._renderScheduleClass(item[1], index)))}
              </ScrollView>
            </View>
            <View style={styles.saveButtonContainer}>
              <TouchableOpacity onPress={this.toggleModal}>
                <View style={styles.saveButton}>
                  <Text>
                    Закрыть
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
      <Drawer
        type="overlay"
        content={
          <DrawerComponent
            onPressOpenSchedule={this.toggleModal}
            onPressAdd={this.onPressAddClass}
            closeDrawer={() => this._drawer.close()}
          />
        }
        openDrawerOffset={0.2}
        closedDrawerOffset={0}
        styles={drawerStyles}
        ref={(ref) => { this._drawer = ref; }}
        tweenHandler={Drawer.tweenPresets.parallax}
      >
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
      </Drawer>
    );
  }
}

export default App;
