import React, { useEffect, useRef } from 'react';
import WebView from 'react-native-webview';
import SplashScreen from 'react-native-splash-screen';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';

const Home = () => {
  const webViewRef = useRef<WebView | null>(null);

  useEffect(() => {
    SplashScreen.hide();
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
          source={{ uri: 'http://localhost:3000' }}
          allowsInlineMediaPlayback={true}
          allowsFullscreenVideo={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          hideKeyboardAccessoryView={true}
          scrollEnabled={false}
          style={styles.container}
        />
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
