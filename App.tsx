import React, { useCallback, useEffect, useRef, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import WebView from 'react-native-webview';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import { getWebViewMessage, createWebViewMessage } from '@utils/bridge.util';

const App = () => {
  const webViewRef = useRef<WebView | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const onMessage = (e: { nativeEvent: { data: string } }) => {
    const { type, message } = getWebViewMessage(e.nativeEvent.data);

    if (type === 'REQ_CAMERA_PERMISSION') {
      console.log(message);
    }
  };

  const sendMessage = (message: string) => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(
        createWebViewMessage('FCM_TOKEN', message)
      );
    }
  };

  const onLoadEnd = () => {
    if (token !== null && webViewRef !== null) {
      sendMessage(token);
    }
  };

  async function checkApplicationPermission() {
    if (Platform.OS === 'ios') {
      const authorizationStatus = await messaging().requestPermission();

      const enabled =
        authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        await messaging()
          .getToken()
          .then((fcmToken) => {
            setToken(fcmToken);
          });
      }
    } else {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      messaging()
        .getToken()
        .then((fcmToken) => {
          setToken(fcmToken);
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        style={styles.container}
      >
        <WebView
          ref={webViewRef}
          source={{ uri: 'http://192.168.0.41:3000' }}
          allowsInlineMediaPlayback={true}
          allowsFullscreenVideo={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          hideKeyboardAccessoryView={true}
          scrollEnabled={false}
          style={styles.container}
          onMessage={onMessage}
          onLoadEnd={onLoadEnd}
        />
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
