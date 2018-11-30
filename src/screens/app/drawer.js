/* eslint-disable no-alert */
import React, { Component } from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  Text,
} from 'react-native';

import { days } from 'AppConstants';
import { getCurrentDay } from 'AppUtils';

import styles from './styles';

const close = require('../../../assets/close.png');

class DrawerComponent extends Component {
  renderDaySchdule = () => {
    const {
      daySchedule,
      onPressSchedule,
    } = this.props;
    const dayTitle = days[getCurrentDay()];
  }

  render() {
    const {
      onPressOpenSchedule,
      closeDrawer,
      onPressAdd,
    } = this.props;
    return (
      <View style={{ paddingTop: 30, paddingHorizontal: 10 }}>
        <TouchableOpacity
          onPress={onPressOpenSchedule}
          style={styles.drawerMenuContainer}
        >
          <Text>Отрыть расписание</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressAdd}
          style={styles.drawerMenuContainer}
        >
          <Text>Добавить расписание</Text>
        </TouchableOpacity>
        {this.renderDaySchdule()}
        <TouchableOpacity
          style={{ position: 'absolute', top: 30, right: 10 }}
          onPress={closeDrawer}
        >
          <Image
            source={close}
            style={{ height: 25, width: 25 }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

export default DrawerComponent;
