/* eslint-disable camelcase */
import ModalDropdown from 'react-native-modal-dropdown';
import React, { Component } from 'react';
import {
  TouchableOpacity,
  TextInput,
  View,
  Text,
} from 'react-native';

import { days } from '../../constants';

import styles from './styles';

class EditClassScreen extends Component {
  constructor(props) {
    super(props);
    const {
      data: {
        day,
        title,
        classValue,
        auditory,
      }
    } = this.props;

    this.state = {
      day,
      title,
      classValue,
      auditory,
    };
  }

  render() {
    const { onPressSave } = this.props;
    const { day, title, classValue, auditory } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Изменить расписание
          </Text>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text>День: </Text>
            <Text>
              {days[day]}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text>Занятие: </Text>
            <Text>{classValue}</Text>
          </View>
          <TextInput
            value={this.state.title}
            onChangeText={text => this.setState({ title: text })}
            placeholder={'Название'}
            style={styles.textInput}
          />
          {/* <ModalDropdown
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
          /> */}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => onPressSave(this.state)}>
            <View style={styles.addButtonContainer}>
              <Text>
                Сохранить
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default EditClassScreen;
