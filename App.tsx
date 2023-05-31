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
  Linking,
} from 'react-native';
import { getWebViewMessage, createWebViewMessage } from '@utils/bridge.util';
import { BridgeType } from '@/types/BridgeType';

const App = () => {
  const webViewRef = useRef<WebView | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hasKakao, setHasKakao] = useState<boolean>(true);

  const onMessage = (e: { nativeEvent: { data: string } }) => {
    const { type, message } = getWebViewMessage(e.nativeEvent.data);

    if (type === 'REQ_CAMERA_PERMISSION') {
      console.log(message);
    }
  };

  const sendMessage = (type: BridgeType, message?: string) => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(createWebViewMessage(type, message));
    }
  };

  const onLoadEnd = () => {
    if (webViewRef == null) return;
    if (token !== null) {
      sendMessage('FCM_TOKEN', token);
    }
    if (!hasKakao) {
      sendMessage('NO_KAKAO');
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
      // android
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      ).then(() => {
        messaging()
          .getToken()
          .then((fcmToken) => {
            setToken(fcmToken);
          });
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

  const handleWebViewLoadStart = () => {
    // 카카오톡 앱 설치 여부 확인
    Linking.canOpenURL('kakaotalk://')
      .then((supported) => {
        if (!supported) {
          // 카카오톡 앱이 설치되지 않은 경우
          setHasKakao(false);
        }
      })
      .catch((error) => {
        console.log('Linking Error:', error);
      });
  };

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
          source={{ uri: 'http://localhost:3000' }}
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
          onLoadStart={handleWebViewLoadStart}
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
