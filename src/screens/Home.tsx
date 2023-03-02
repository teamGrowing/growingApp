import React, { useRef } from 'react';
import WebView from 'react-native-webview';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';

function wait(timeout: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, timeout);
  });
}

const Home = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const webViewRef = useRef<WebView | null>(null);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    webViewRef.current?.reload();
    wait(2000).then(() => setRefreshing(false));
  }, [refreshing]);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView
          style={styles.ScrollStyle}
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onRefresh} />
          }
        >
          <WebView
            ref={webViewRef}
            automaticallyAdjustContentInsets={false}
            source={{ uri: 'http://localhost:3000' }}
            allowsFullscreenVideo={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            style={styles.container}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  ScrollStyle: {
    backgroundColor: 'white',
    position: 'relative',
  },
});
