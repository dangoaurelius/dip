/* eslint-disable camelcase */
import ModalDropdown from 'react-native-modal-dropdown';
import React, { Component } from 'react';
import {
  TouchableOpacity,
  TextInput,
  Image,
  View,
  Text,
} from 'react-native';

import { days } from '../../constants';

import styles from './styles';

const back = require('../../../assets/back.png');

class AddClassScreen extends Component {
  onPickDay = (item) => {
    const { onValueChange } = this.props;
    onValueChange('dayValue', Number(item) + 1);
  }

  renderDayDropdownValue = () => {
    const { getValue } = this.props;
    return (
      <View style={{ alignSelf: 'stretch', paddingVertical: 10, justifyContent: 'center' }}>
        <Text>{days[getValue('dayValue')]}</Text>
      </View>
    );
  }

  render() {
    const {
      getValue,
      onPressAdd,
      dayOptions,
      onPressClose,
      classOptions,
      onValueChange,
      housingOptions,
      auditoryOptions,
      getAuditoryList,
    } = this.props;

    const housingValue = getValue('housingValue');
    const auditoryList = getAuditoryList(housingValue);

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <TouchableOpacity
            onPress={onPressClose}
            style={{ alignSelf: 'flex-start', paddingLeft: 10 }}
          >
            <Image
              style={{ height: 25, width: 25 }}
              source={back}
            />
          </TouchableOpacity>
          <Text style={styles.title}>
            Добавить расписание
          </Text>
          <View style={{ paddingLeft: 10, height: 25, width: 25 }} />
        </View>
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <TextInput
            placeholder={'Название'}
            style={styles.textInput}
            onChangeText={value => onValueChange('title', value)}
            value={getValue('title')}
          />
          <View style={{ marginTop: 20, paddingBottom: 10 }}>
            <Text style={{ marginBottom: 10 }}>
              Номер занятия
            </Text>
            <ModalDropdown
              options={classOptions}
              defaultIndex={1}
              onSelect={value => onValueChange('classValue', Number(value) + 1)}
              style={{ alignSelf: 'stretch' }}
              dropdownStyle={{ width: 200 }}
              renderRow={item => (
                <View style={styles.rowContainer}>
                  <Text>Занятие {item}</Text>
                </View>
              )}
            />
          </View>
          <View style={{ marginTop: 20, paddingBottom: 10 }}>
            <Text style={{ marginBottom: 10 }}>
              Корпус
            </Text>
            <ModalDropdown
              options={housingOptions}
              defaultIndex={1}
              onSelect={value => onValueChange('housingValue', Number(value) + 1)}
              style={styles.dropdown}
              dropdownStyle={{ width: 200 }}
              renderRow={item => (
                <View style={styles.rowContainer}>
                  <Text>Корпус {item}</Text>
                </View>
              )}
            />
          </View>
          <View style={{ marginTop: 20, paddingBottom: 10 }}>
            <Text style={{ marginBottom: 10 }}>
              Аудитория
            </Text>
            <ModalDropdown
              disabled={!housingValue}
              options={auditoryList}
              defaultIndex={1}
              onSelect={value => onValueChange('auditoryValue', Number(auditoryList[value]))}
              style={[styles.dropdown, { backgroundColor: housingValue ? 'transparent' : 'rgb(229, 228, 229)', borderRadius: 3 }]}
              textStyle={{ color: housingValue ? 'rgb(0, 0, 0)' : 'rgb(103, 103, 103)' }}
              dropdownStyle={{ width: 200 }}
              renderRow={item => (
                <View style={[styles.rowContainer]}>
                  <Text>Аудитория {item}</Text>
                </View>
              )}
            />
          </View>
          <View style={{ marginTop: 20, paddingBottom: 10 }}>
            <Text style={{ marginBottom: 10 }}>
              День недели
            </Text>
            <ModalDropdown
               options={dayOptions}
               defaultIndex={1}
               onSelect={this.onPickDay}
               style={styles.dropdown}
               dropdownStyle={{ width: 200 }}
               renderRow={item => (
                 <View style={styles.rowContainer}>
                   <Text>{item.title}</Text>
                 </View>
               )}
            >
              {this.renderDayDropdownValue()}
            </ModalDropdown>
          </View>
        </View>
        <View style={styles.buttonContainer}>
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
