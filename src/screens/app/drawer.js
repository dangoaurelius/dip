/* eslint-disable no-alert */
import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

class DrawerComponent extends Component {

  render() {
    const {
      onPressOpenSchedule,
      closeDrawer,
      onPressAdd,
    } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: 'lightgrey', paddingTop: 40, paddingHorizontal: 10, }}>
        <TouchableOpacity style={{ alignItems: 'flex-end' }} onPress={closeDrawer}>
          <Text>Закрыть</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressAdd}>
          <Text>Добавить расписание</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressOpenSchedule}>
          <Text>Отрыть расписание</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default DrawerComponent;
