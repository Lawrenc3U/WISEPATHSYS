import { Alert, Platform } from 'react-native';

/**
 * Cross-platform confirm dialog. Alert.alert is unreliable on web.
 */
export const confirmAction = (
  title: string,
  message: string,
  confirmLabel: string,
  onConfirm: () => void | Promise<void>,
  options?: { destructive?: boolean }
): void => {
  const run = () => {
    void Promise.resolve(onConfirm());
  };

  if (Platform.OS === 'web') {
    const ok =
      typeof globalThis !== 'undefined' &&
      typeof (globalThis as { confirm?: (msg: string) => boolean }).confirm ===
        'function' &&
      (globalThis as { confirm: (msg: string) => boolean }).confirm(
        message ? `${title}\n\n${message}` : title
      );
    if (ok) run();
    return;
  }

  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    {
      text: confirmLabel,
      style: options?.destructive ? 'destructive' : 'default',
      onPress: run,
    },
  ]);
};
