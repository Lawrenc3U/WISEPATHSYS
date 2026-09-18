import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { AlertCircle, CheckCircle2, AlertTriangle, X, RefreshCw } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography } from '../utils/theme';

export type BannerType = 'error' | 'success' | 'warning';

interface ErrorBannerProps {
  message: string;
  type?: BannerType;
  onDismiss?: () => void;
  onRetry?: () => void;
  /** Auto-dismiss after ms. Defaults to 3000 for success, never for others. */
  autoDismissMs?: number;
}

const CONFIG: Record<BannerType, { bg: string; border: string; text: string; iconColor: string }> = {
  error: { bg: '#FEF2F2', border: 'rgba(239,68,68,0.4)', text: '#B91C1C', iconColor: '#B91C1C' },
  success: { bg: '#F0FDF4', border: 'rgba(16,185,129,0.4)', text: '#065F46', iconColor: '#065F46' },
  warning: { bg: '#FFFBEB', border: 'rgba(245,158,11,0.4)', text: '#92400E', iconColor: '#B45309' },
};

const BannerIcon: React.FC<{ type: BannerType; color: string }> = ({ type, color }) => {
  const size = 16;
  if (type === 'success') return <CheckCircle2 size={size} color={color} />;
  if (type === 'warning') return <AlertTriangle size={size} color={color} />;
  return <AlertCircle size={size} color={color} />;
};

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  type = 'error',
  onDismiss,
  onRetry,
  autoDismissMs,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-6)).current;
  const cfg = CONFIG[type];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();

    const delay = autoDismissMs ?? (type === 'success' ? 3000 : undefined);
    if (delay && onDismiss) {
      const t = setTimeout(onDismiss, delay);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: cfg.bg, borderColor: cfg.border, opacity, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.iconWrap}>
        <BannerIcon type={type} color={cfg.iconColor} />
      </View>
      <Text style={[styles.message, { color: cfg.text }]} numberOfLines={4}>
        {message}
      </Text>
      <View style={styles.actions}>
        {onRetry && (
          <TouchableOpacity onPress={onRetry} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <RefreshCw size={14} color={cfg.text} />
          </TouchableOpacity>
        )}
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <X size={14} color={cfg.text} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  iconWrap: { paddingTop: 2 },
  message: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: '500',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: 1,
  },
});
