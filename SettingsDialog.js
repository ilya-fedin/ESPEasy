import React, { Component } from 'react';
import { Platform, StatusBar, Text, TextInput, View } from 'react-native';
import { Button, Dialog, DialogDefaultActions, Toolbar } from 'react-native-material-ui';
import { TextField } from 'react-native-material-textfield';

import Settings from './Settings';
import UITheme from './UITheme';
import Styles from './Styles';

export default class SettingsDialog extends Component {
  state = {
    host: "",
    gpio: "",
  }

  constructor() {
    super();

    if(Platform.OS != 'windows')
      this.dialogContent =
        (<View>
          <TextField
            label="Хост"
            value={this.state.host}
            tintColor={UITheme.palette.primaryColor}
            onChangeText={(text) => this.setState({host: text})}
          />
          <TextField
            label="GPIO"
            value={this.state.gpio}
            tintColor={UITheme.palette.primaryColor}
            onChangeText={(text) => this.setState({gpio: text})}
          />
        </View>);
    else
      this.dialogContent =
        (<View>
          <Text>Хост:</Text>
          <TextInput
            value={this.state.host}
            onChangeText={(text) => this.setState({host: text})}
          />
          <Text>GPIO:</Text>
          <TextInput
            value={this.state.gpio}
            onChangeText={(text) => this.setState({gpio: text})}
          />
        </View>);
  }

  save = () => {
    Settings.set(this.state.host, this.state.gpio)
      .then(() => this.props.navigation.goBack());
  }

  componentWillMount() {
    Settings.get()
      .then((host, gpio) => {
        this.setState({host, gpio});
      });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar
          backgroundColor="#64B5F6"
          barStyle="light-content"
        />
        <Toolbar
          centerElement="ESPEasy"
          rightElement={
            <Button
                text="Настройки"
                style={{ text: { color: 'white' } }}
                onPress={() => this.props.navigation.navigate('Settings')}
            />
          }
        />
        <View style={Styles.container}>
          <Dialog>
            <Dialog.Title><Text>Настройки</Text></Dialog.Title>
            <Dialog.Content>
              {this.dialogContent}
            </Dialog.Content>
            <Dialog.Actions>
              <DialogDefaultActions
                actions={['Отмена', 'Сохранить']}
                onActionPress={() => this.save()}
              />
            </Dialog.Actions>
          </Dialog>
        </View>
      </View>
    );
  }
}
