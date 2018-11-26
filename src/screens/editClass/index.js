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

  onPressSave = () => {
    const {
      setScheduleAction,
      removeScheduleAction,
      edit: {
        day,
        title,
        auditory,
        classValue,
      },
    } = this.props;

    removeScheduleAction({ day, classValue });
    setScheduleAction({
      day,
      title,
      auditory,
      classValue,
    });
  }

  render() {
    const { edit } = this.props;
    return (
      <EditClassScreen
        data={edit}
      />
    );
  }
}

export default EditClassContainer;
