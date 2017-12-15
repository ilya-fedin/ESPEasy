import React from 'react';
import { AsyncStorage, StatusBar, StyleSheet, Text, View, UIManager } from 'react-native';
import { Button, IconToggle, ThemeProvider, Toolbar } from 'react-native-material-ui';
import { MaterialDialog } from 'react-native-material-dialog';
import { TextField } from 'react-native-material-textfield';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

const uiTheme = {
   palette: {
       primaryColor: '#2196F3',
       accentColor: '#536DFE',
   },
}

export default class App extends React.Component {
  state = {
    status: null,
    statusText: "Неизвестно",
    toggleColor: "",
    host: "",
    gpio: "",
    settingsVisible: false
  }

  constructor() {
    super();

    this.getSettings();
    this.updateLoop();
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
    fetch("http://" + this.state.host + "/control?cmd=Status,GPIO," + this.state.gpio)
      .then(response => response.json())
      .then((response) => {
        if(response.state == 1) {
          this.setStatus(true);
        } else if(response.state == 0) {
          this.setStatus(false);
        }
      })
      .catch(() => this.setStatus());

  updateLoop = () =>
    this.update()
      .then(() => setTimeout(this.updateLoop, 500));

  toggle = () => {
    if(this.state.status === true) {
      return fetch("http://" + this.state.host + "/control?cmd=GPIO," + this.state.gpio + ",0")
        .then(response => response.json())
        .then((response) => {
          this.setStatus(false);
        })
        .catch(() => this.setStatus());
    } else if(this.state.status === false) {
      return fetch("http://" + this.state.host + "/control?cmd=GPIO," + this.state.gpio + ",1")
        .then(response => response.json())
        .then((response) => {
          this.setStatus(true);
        })
        .catch(() => this.setStatus());
    }
  }

  getSettings = () => {
    AsyncStorage.getItem('host', (err, result) => {
      this.setState({host: result != null ? result : ''});
      AsyncStorage.getItem('gpio', (err, result) => {
        this.setState({gpio: result != null ? result : ''});
        this.setState({settingsVisible: false})
        this.update();
      });
    });
  }

  updateSettings = () => {
    AsyncStorage.setItem('host', this.state.host);
    AsyncStorage.setItem('gpio', this.state.gpio);
    this.setState({settingsVisible: false});
    this.update();
  }

  render() {
    return (
      <ThemeProvider uiTheme={uiTheme}>
        <View style={{flex: 1}}>
          <StatusBar
            backgroundColor="#64B5F6"
            barStyle="light-content"
          />
          <Toolbar
            centerElement="ESPEasy"
            rightElement={
              <Button
                  onPress={() => this.setState({settingsVisible: true})}
                  text="Настройки"
                  style={{ text: { color: 'white' } }}
              />
            }
          />
          <MaterialDialog
            title="Настройки"
            colorAccent={uiTheme.palette.accentColor}
            visible={this.state.settingsVisible}
            okLabel="CОХРАНИТЬ"
            cancelLabel="ОТМЕНА"
            onOk={this.updateSettings}
            onCancel={this.getSettings}
          >
            <View>
              <TextField
                label="Хост"
                value={this.state.host}
                tintColor={uiTheme.palette.primaryColor}
                onChangeText={(text) => this.setState({host: text})}
              />
              <TextField
                label="GPIO"
                value={this.state.gpio}
                tintColor={uiTheme.palette.primaryColor}
                onChangeText={(text) => this.setState({gpio: text})}
              />
            </View>
          </MaterialDialog>
          <View style={styles.container}>
            <Text style={{fontSize: 46}}>{this.state.statusText}</Text>
            <IconToggle
              onPress={this.toggle}
              color={this.state.toggleColor}
              size={86}
              name="power-settings-new"
            />
          </View>
        </View>
      </ThemeProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
