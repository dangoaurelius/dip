import React from 'react';
import { View, Text } from 'react-native';

import styles from './styles';

const Field = ({ title, children }) => (
  <View style={styles.container}>
    <Text style={styles.titleText}>
      {title}
    </Text>
    {children}
  </View>
);

export default Field;
