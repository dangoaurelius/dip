/* eslint-disable camelcase */
import ModalDropdown from 'react-native-modal-dropdown';
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

import { days } from '../../constants';

import styles from './styles';

class AddClassScreen extends Component {
  onPickDay = (item) => {
    const { onValueChange } = this.props;
    onValueChange('dayValue', Number(item) + 1);
  }

  renderDayDropdownValue = () => {
    const { getValue } = this.props;
    return (
      <View style={{
        alignSelf: 'stretch', paddingVertical: 10, justifyContent: 'center',
      }}>
        <Text>{days[getValue('dayValue')]}</Text>
      </View>
    );
  }

  render() {
    const {
      getValue,
      onPressAdd,
      dayOptions,
      classOptions,
      onValueChange,
      housingOptions,
      auditoryOptions,
      getAuditoryList,
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
          <ModalDropdown
             options={classOptions}
             defaultIndex={1}
             onSelect={value => onValueChange('classValue', Number(value) + 1)}
             style={{ alignSelf: 'stretch', marginTop: 20 }}
             dropdownStyle={{ width: 200 }}
             renderRow={item => (
               <View style={{
                 alignSelf: 'stretch', paddingVertical: 10, paddingHorizontal: 10, alignItems: 'center',
               }}>
                 <Text>{item}</Text>
               </View>
             )}
          />
          <ModalDropdown
             options={housingOptions}
             defaultIndex={1}
             onSelect={value => onValueChange('housingValue', Number(value) + 1)}
             style={{ alignSelf: 'stretch', marginTop: 20 }}
             dropdownStyle={{ width: 200 }}
             renderRow={item => (
               <View style={styles.rowContainer}>
                 <Text>Корпус {item}</Text>
               </View>
             )}
          />
          <ModalDropdown
             disabled={!getValue('housingValue')}
             options={getAuditoryList(getValue('housingValue'))}
             defaultIndex={1}
             onSelect={value => onValueChange('auditoryValue', Number(value) + 1)}
             style={{ alignSelf: 'stretch', marginTop: 20 }}
             dropdownStyle={{ width: 200 }}
             renderRow={item => (
               <View style={styles.rowContainer}>
                 <Text>Аудитория {item}</Text>
               </View>
             )}
          />
          <View style={{ width: '100%', height: 40 }}>
            <ModalDropdown
               options={dayOptions}
               defaultIndex={1}
               onSelect={this.onPickDay}
               style={{ alignSelf: 'stretch', marginTop: 20 }}
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
