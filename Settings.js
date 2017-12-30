import { AsyncStorage } from 'react-native';

export default {
  get: () =>
    new Promise((resolve, reject) => {
      AsyncStorage.getItem('host', (err, result) => {
        var host = result != null ? result : '';
        AsyncStorage.getItem('gpio', (err, result) => {
          var gpio = result != null ? result : '';
          resolve({host: host, gpio: gpio});
        });
      });
    }),
    
  set: (host, gpio) =>
    new Promise((resolve, reject) => {
      AsyncStorage.setItem('host', host, (err, result) => {
        AsyncStorage.setItem('gpio', gpio, (err, result) => {
          resolve();
        });
      });
    })
}
