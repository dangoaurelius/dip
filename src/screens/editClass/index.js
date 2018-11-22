/* eslint-disable no-alert */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import EditClassScreen from './editClass';

@connect(null, null)
class EditClassContainer extends Component {
  render() {
    return (
      <EditClassScreen />
    );
  }
}

export default EditClassContainer;
