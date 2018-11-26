/* eslint-disable camelcase */
import ModalDropdown from 'react-native-modal-dropdown';
import React, { Component } from 'react';
import {
  TouchableOpacity,
  TextInput,
  View,
  Text,
} from 'react-native';

import styles from './styles';

class EditClassScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Изменить расписание
          </Text>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <TextInput
            placeholder={'Название'}
            style={styles.textInput}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity>
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
