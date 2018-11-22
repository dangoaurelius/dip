/* eslint-disable no-alert */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  setSchedule,
} from '../../redux/actions';

import AddClassScreen from './addClass';

@connect(state => ({
  scheduleState: state.schedule,
}), {
  addScheduleAction: setSchedule,
})
class AddClassContainer extends Component {
  state = {
    title: '',
    dayValue: 1,
    classValue: '',
    auditoryValue: '',
  }

  componentDidMount() {
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

  onValueChange = (key, value) => this.setState({ [key]: value });

  getValue = key => (this.state[key]);

  render() {
    return (
      <AddClassScreen
        onPressAdd={this.onPressAdd}
        getValue={this.getValue}
        onValueChange={this.onValueChange}
      />
    );
  }
}

export default AddClassContainer;
