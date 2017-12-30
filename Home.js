import React, { Component } from 'react';
import { StatusBar, Text, View } from 'react-native';
import { Button, IconToggle, Toolbar } from 'react-native-material-ui';

import Settings from './Settings';
import Styles from './Styles';

export default class Home extends Component {
  state = {
    status: null,
    statusText: "Неизвестно",
    toggleColor: ""
  }

  setStatus = (status) => {
    if(status === true) {
      this.setState({status: true});
      this.setState({statusText: "Включено"});
      this.setState({toggleColor: "green"});
    } else if(status === false) {
      this.setState({status: false});
      this.setState({statusText: "Выключено"});
      this.setState({toggleColor: ""});
    } else {
      this.setState({status: null});
      this.setState({statusText: "Неизвестно"});
      this.setState({toggleColor: ""});
    }
  }
  
  update = () =>
    new Promise((resolve, reject) => {
      Settings.get()
        .then((settings) => {
          if(settings.host.length > 0 && settings.gpio.length > 0) {
            fetch("http://" + settings.host + "/control?cmd=Status,GPIO," + settings.gpio)
              .then(response => response.json())
              .then((response) => {
                if(response.state == 1) {
                  this.setStatus(true);
                } else if(response.state == 0) {
                  this.setStatus(false);
                }
                resolve();
              })
              .catch(() => {
                this.setStatus();
                resolve();
              });
          } else {
            this.setStatus();
            resolve();
          }
        });
    });

  updateLoop = () =>
    this.update()
      .then(() => setTimeout(this.updateLoop, 500));

  toggle = () => {
    Settings.get()
      .then((settings) => {
        if(settings.host.length > 0 && settings.gpio.length > 0) {
          if(this.state.status === true) {
            fetch("http://" + settings.host + "/control?cmd=GPIO," + settings.gpio + ",0")
              .then(response => response.json())
              .then((response) => {
                this.setStatus(false);
              })
              .catch(() => this.setStatus());
          } else if(this.state.status === false) {
            fetch("http://" + settings.host + "/control?cmd=GPIO," + settings.gpio + ",1")
              .then(response => response.json())
              .then((response) => {
                this.setStatus(true);
              })
              .catch(() => this.setStatus());
          } else {
            this.setStatus();
          }
        }
      });
  }

  componentWillMount() {
    this.updateLoop();
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
          <Text style={{fontSize: 46}}>{this.state.statusText}</Text>
          <IconToggle
            name="power-settings-new"
            color={this.state.toggleColor}
            size={86}
            onPress={this.toggle}
          />
        </View>
      </View>
    );
  }
}
