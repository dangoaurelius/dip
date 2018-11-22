import React from 'react';
import {
  registerScreens,
  start,
} from './navigations';

import store from './redux';

registerScreens(store);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    start();
  }
}
