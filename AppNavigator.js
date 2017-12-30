import { StackNavigator } from 'react-navigation';

import Home from './Home';
import SettingsDialog from './SettingsDialog';

const AppNavigator = StackNavigator({
  Home: {
   screen: Home,
  },
  Settings: {
   screen: SettingsDialog,
  }
}, {
    headerMode: 'none',
});

export default AppNavigator;
