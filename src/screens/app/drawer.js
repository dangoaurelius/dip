/* eslint-disable no-alert */
import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

import styles from './styles';

class DrawerComponent extends Component {
  render() {
    const {
      onPressOpenSchedule,
      closeDrawer,
      onPressAdd,
    } = this.props;
    return (
      <View style={{ paddingTop: 40, paddingHorizontal: 10, }}>
        <TouchableOpacity style={{ alignItems: 'flex-end' }} onPress={closeDrawer}>
          <Text>Закрыть</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressAdd}
          style={styles.drawerMenuContainer}
        >
          <Text>Добавить расписание</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressOpenSchedule}
          style={styles.drawerMenuContainer}
        >
          <Text>Отрыть расписание</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default DrawerComponent;
