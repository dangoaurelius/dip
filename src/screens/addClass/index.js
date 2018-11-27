/* eslint-disable no-alert */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Voice from 'react-native-voice';
import {
  Platform,
} from 'react-native';

import {
  setSchedule,
} from '../../redux/actions';

import AddClassScreen from './addClass';

import { auditory } from '../../constants';

const dayOptions = [
  { title: 'Понедельник', value: 1 },
  { title: 'Вторник', value: 2 },
  { title: 'Среда', value: 3 },
  { title: 'Четверг', value: 4 },
  { title: 'Пятница', value: 5 },
  { title: 'Суббота', value: 6 },
];

const housingOptions = [1, 2, 3, 4, 5];
const classOptions = [1, 2, 3, 4, 5, 6];

let timeout;

@connect(state => ({
  scheduleState: state.schedule,
}), {
  addScheduleAction: setSchedule,
})
class AddClassContainer extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      dayValue: 1,
      classValue: '',
      auditoryValue: '',
    };
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

  onPressAdd = () => {
    const {
      title,
      dayValue,
      classValue,
      auditoryValue,
    } = this.state;
    const { addScheduleAction } = this.props;

    addScheduleAction(
      {
        title,
        classValue,
        day: dayValue,
        auditory: Object.entries(auditory)[auditoryValue][0],
      },
    );
    this.setState({
      title: '',
      classValue: '',
      auditoryValue: '',
    });
  };

  getAuditoryList = (housing) => {
    const result = [];
    const entries = Object.entries(auditory);
    entries.forEach((item) => {
      if (item[1].housing === housing) {
        result.push(item[0]);
      }
    });
    return result;
  }

  onValueChange = (key, value) => this.setState({ [key]: value });

  getValue = key => (this.state[key]);

  render() {
    return (
      <AddClassScreen
        getAuditoryList={this.getAuditoryList}
        housingOptions={housingOptions}
        classOptions={classOptions}
        dayOptions={dayOptions}
        onPressAdd={this.onPressAdd}
        getValue={this.getValue}
        onValueChange={this.onValueChange}
      />
    );
  }
}

export default AddClassContainer;
