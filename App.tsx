import React, { useCallback, useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import Home from './src/screens/Home';

const App = () => {
  async function checkApplicationPermission() {
    const authorizationStatus = await messaging().requestPermission();

    const enabled =
      authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log('User has notification permissions enabled.');
    } else if (
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      console.log('User has provisional notification permissions.');
    } else {
      console.log('User has notification permissions disabled');
    }

    if (enabled) {
      await messaging()
        .getToken()
        .then((fcmToken) => {
          console.log('fcmToken:', fcmToken);
        });
    }
  }

  useEffect(() => {
    checkApplicationPermission();
  }, []);

  const foregroundListener = useCallback(() => {
    messaging().onMessage(async (message) => {
      console.log('foreground message', message.notification?.body);
    });
  }, []);

  useEffect(() => {
    foregroundListener();
  }, []);

  return <Home></Home>;
};
export default App;
