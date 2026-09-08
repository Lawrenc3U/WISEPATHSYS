import React from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './navigation/RootNavigator';
import { colors } from './utils/theme';

// Root App Component with integrated navigation and gesture handler
export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="dark" backgroundColor={colors.background} />
      <RootNavigator />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
