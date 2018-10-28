import React, { Component } from 'react';
import {
  registerScreens,
  start
} from './navigations';



registerScreens();

export default class App extends Component {
  constructor(props) {
    super(props);
    start();
  }
}
