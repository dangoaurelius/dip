/* eslint-disable no-alert */
import React, { Component } from 'react';
import { connect } from 'react-redux';

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

@connect(state => ({
  scheduleState: state.schedule,
}), {
  addScheduleAction: setSchedule,
})
class AddClassContainer extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  state = {
    title: '',
    dayValue: 1,
    classValue: '',
    auditoryValue: '',
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
        auditory: auditoryValue,
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
