import React, { Component, ErrorInfo, ReactNode, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './navigation/RootNavigator';
import { colors, spacing, typography } from './utils/theme';

class AppErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[App] Uncaught render error:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.errorScreen}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <ScrollView style={styles.errorScroll}>
            <Text style={styles.errorBody}>{String(this.state.error.message)}</Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    setBooted(true);
    console.log('[App] UI mount OK');
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <AppErrorBoundary>
          <StatusBar style="dark" />
          {!booted ? (
            <View style={styles.boot}>
              <Text style={styles.bootText}>Starting WisePath…</Text>
            </View>
          ) : (
            <RootNavigator />
          )}
        </AppErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  bootText: {
    fontSize: typography.sizes.base,
    color: colors.text,
    fontWeight: typography.weights.semibold,
  },
  errorScreen: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  errorTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.error,
    marginBottom: spacing.md,
  },
  errorScroll: {
    maxHeight: 280,
  },
  errorBody: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    lineHeight: 20,
  },
});
