/* eslint-disable no-alert */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  setSchedule,
  removeSchedule,
} from '../../redux/actions';

import EditClassScreen from './editClass';

@connect(state => ({
  edit: state.edit,
}), {
  setScheduleAction: setSchedule,
  removeScheduleAction: removeSchedule,
})
class EditClassContainer extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  onPressClose = () => {
    const { navigator } = this.props;
    navigator.pop();
  }

  onPressSave = (data) => {
    const {
      setScheduleAction,
      removeScheduleAction,
    } = this.props;
    const {
      day,
      title,
      auditory,
      classValue,
    } = data;

    setScheduleAction({
      day,
      title,
      auditory,
      classValue,
    });
    this.onPressClose();
  }

  render() {
    const { edit } = this.props;
    return (
      <EditClassScreen
        data={edit}
        onPressClose={this.onPressClose}
        onPressSave={this.onPressSave}
      />
    );
  }
}

export default EditClassContainer;
