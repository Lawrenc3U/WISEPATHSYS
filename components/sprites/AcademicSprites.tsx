import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  G,
  Line,
  Path,
  Rect,
} from 'react-native-svg';
import { colors } from '../../utils/theme';

interface SpriteProps {
  size?: number;
}

const hiddenProps = {
  accessible: false,
  accessibilityElementsHidden: true,
  importantForAccessibility: 'no-hide-descendants' as const,
};

export const StudentGuide: React.FC<SpriteProps> = ({ size = 104 }) => (
  <Svg width={size} height={size} viewBox="0 0 120 120" {...hiddenProps}>
    <Circle cx="60" cy="60" r="55" fill={colors.highlightSoft} />
    <Circle cx="60" cy="43" r="20" fill="#F5C9A9" />
    <Path
      d="M40 42c2-17 11-25 22-25 13 0 21 10 20 26-5-8-13-12-24-12-7 0-13 4-18 11Z"
      fill={colors.highlight}
    />
    <Path d="M35 28 60 17l27 11-27 11-25-11Z" fill={colors.text} />
    <Path d="M83 29v17" stroke={colors.warning} strokeWidth="3" />
    <Circle cx="83" cy="48" r="3" fill={colors.warning} />
    <Circle cx="52" cy="43" r="2" fill={colors.text} />
    <Circle cx="68" cy="43" r="2" fill={colors.text} />
    <Path
      d="M53 52c4 4 10 4 14 0"
      fill="none"
      stroke={colors.text}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M32 105c2-27 12-40 28-40s27 13 29 40H32Z"
      fill={colors.highlight}
    />
    <Path d="M36 76 60 88l24-12v28H36V76Z" fill={colors.surfaceElevated} />
    <Line x1="60" y1="88" x2="60" y2="105" stroke={colors.accent} strokeWidth="2" />
  </Svg>
);

export const CampusBadge: React.FC<SpriteProps> = ({ size = 88 }) => (
  <Svg width={size} height={size} viewBox="0 0 120 120" {...hiddenProps}>
    <Circle cx="60" cy="60" r="56" fill="rgba(255,255,255,0.18)" />
    <Rect x="26" y="69" width="68" height="13" rx="6" fill={colors.surface} />
    <Rect x="32" y="84" width="60" height="12" rx="6" fill={colors.accent} />
    <Rect x="24" y="97" width="72" height="10" rx="5" fill={colors.surfaceElevated} />
    <Path d="M22 45 59 29l39 16-39 17-37-17Z" fill={colors.surfaceElevated} />
    <Path d="M39 53v16c12 8 29 8 41 0V53L59 62 39 53Z" fill={colors.warning} />
    <Path d="M94 46v20" stroke={colors.surface} strokeWidth="4" />
    <Circle cx="94" cy="69" r="4" fill={colors.surface} />
  </Svg>
);

interface EmptyStateSpriteProps extends SpriteProps {
  variant?: 'assessment' | 'progress' | 'recommendations';
}

export const EmptyStateSprite: React.FC<EmptyStateSpriteProps> = ({
  size = 124,
  variant = 'assessment',
}) => {
  const accent =
    variant === 'progress'
      ? colors.success
      : variant === 'recommendations'
        ? colors.warning
        : colors.highlight;

  return (
    <Svg width={size} height={size} viewBox="0 0 140 140" {...hiddenProps}>
      <Ellipse cx="70" cy="120" rx="48" ry="8" fill={colors.highlightSoft} />
      <Circle cx="70" cy="61" r="47" fill={colors.surfaceElevated} />
      <Circle cx="70" cy="61" r="42" fill={colors.highlightSoft} />
      <Path
        d="M45 43h50v46H45z"
        fill={colors.surfaceElevated}
        stroke={colors.highlight}
        strokeWidth="3"
      />
      <Rect x="55" y="35" width="30" height="14" rx="5" fill={accent} />
      <Line x1="56" y1="60" x2="84" y2="60" stroke={colors.accent} strokeWidth="4" strokeLinecap="round" />
      <Line x1="56" y1="70" x2="88" y2="70" stroke={colors.accent} strokeWidth="4" strokeLinecap="round" />
      <Line x1="56" y1="80" x2="77" y2="80" stroke={colors.accent} strokeWidth="4" strokeLinecap="round" />
      {variant === 'recommendations' ? (
        <Path d="m103 30 3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8Z" fill={accent} />
      ) : (
        <Circle cx="105" cy="41" r="9" fill={accent} />
      )}
    </Svg>
  );
};

export const DecorativeBlobs = () => (
  <View pointerEvents="none" style={styles.decorations} {...hiddenProps}>
    <Svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="none">
      <Circle cx="368" cy="45" r="90" fill={colors.accent} opacity="0.11" />
      <Circle cx="18" cy="800" r="105" fill={colors.surface} opacity="0.34" />
      <G opacity="0.12">
        <Circle cx="335" cy="150" r="5" fill={colors.highlight} />
        <Circle cx="355" cy="170" r="3" fill={colors.highlight} />
        <Circle cx="318" cy="176" r="4" fill={colors.highlight} />
      </G>
    </Svg>
  </View>
);

const styles = StyleSheet.create({
  decorations: {
    ...StyleSheet.absoluteFillObject,
  },
});
