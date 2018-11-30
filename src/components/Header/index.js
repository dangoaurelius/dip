/* eslint-disable camelcase */
import React, { Component } from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  Text,
} from 'react-native';

import styles from './styles';

class Header extends Component {
  renderLeftButton = () => {
    const { leftIcon, onPressLeftIcon } = this.props;
    return (
      <View>
      </View>
    );
  }

  renderRightButton = () => {
    const { leftRight, onPressRightIcon } = this.props;
    return (
      <View>
      </View>
    );
  }

  render() {
    const { title } = this.props;

    return (
      <View style={styles.container}>
        {this.renderLeftButton()}
        <Text>
          {title}
        </Text>
        {this.renderRightButton()}
      </View>
    );
  }
}

export default Header;
