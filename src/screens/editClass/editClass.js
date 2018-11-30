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
    const {
      onPressSave,
      onPressClose
    } = this.props;
    const { day, title, classValue, auditory } = this.state;
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
            Изменить расписание
          </Text>
          <View style={{ paddingLeft: 10, height: 25, width: 25 }} />
        </View>
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <View style={{ marginBottom: 30, flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.grayText}>
                {'День: '}
              </Text>
              <Text style={styles.grayText}>
                {days[day]}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.grayText}>
                {'Занятие: '}
              </Text>
              <Text style={styles.grayText}>
                {classValue}
              </Text>
            </View>
          </View>
          <Text>
            Название:
          </Text>
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
            <View style={styles.editButtonContainer}>
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
