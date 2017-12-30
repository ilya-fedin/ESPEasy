import React, { Component } from 'react';
import { UIManager } from 'react-native';
import { ThemeProvider } from 'react-native-material-ui';

import AppNavigator from './AppNavigator';
import UITheme from './UITheme';

export default class App extends Component {
  componentWillMount() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  render() {
    return (
      <ThemeProvider uiTheme={UITheme}>
        <AppNavigator />
      </ThemeProvider>
    );
  }
}
