/* eslint-disable camelcase */
import React, { Component } from 'react';
import {
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  TextInput,
  FlatList,
  Picker,
  Image,
  View,
  Text,
} from 'react-native';

import styles from './styles';

class AddClassScreen extends Component {
  render() {
    const {
      getValue,
      onPressAdd,
      onValueChange,
    } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Добавить расписание
          </Text>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <TextInput
            placeholder={'Название'}
            style={styles.textInput}
            onChangeText={value => onValueChange('title', value)}
            value={getValue('title')}
          />
          <TextInput
            placeholder={'Номер занятия (1 - 9)'}
            style={styles.textInput}
            onChangeText={value => onValueChange('classValue', value)}
            value={getValue('classValue')}
          />
          <TextInput
            placeholder={'Номер аудитории'}
            style={styles.textInput}
            onChangeText={value => onValueChange('auditoryValue', value)}
            value={getValue('auditoryValue')}
          />
          <View style={{ width: '100%', height: 40 }}>
            <Picker
              selectedValue={getValue('dayValue')}
              style={{ height: 40, width: '100%' }}
              onValueChange={value => onValueChange('dayValue', value)}
            >
              <Picker.Item label="Понедельник" value="1" />
              <Picker.Item label="Вторник" value="2" />
              <Picker.Item label="Среда" value="3" />
              <Picker.Item label="Четверг" value="4" />
              <Picker.Item label="Пятница" value="5" />
              <Picker.Item label="Суббота" value="6" />
            </Picker>
          </View>
        </View>
        <View style={{ width: '100%', alignItems: 'center', paddingVertical: 25, }}>
          <TouchableOpacity onPress={onPressAdd}>
            <View style={styles.addButtonContainer}>
              <Text>
                Добавить
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default AddClassScreen;
