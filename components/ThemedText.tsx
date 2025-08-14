import { StyleSheet, Text, type TextProps } from 'react-native';
import theme from '../constants/theme';
import { fp } from '../utils/responsive';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: theme.fontSize.md,
    lineHeight: fp(24),
  },
  defaultSemiBold: {
    fontSize: theme.fontSize.md,
    lineHeight: fp(24),
    fontWeight: '600',
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    lineHeight: fp(32),
  },
  subtitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: fp(30),
    fontSize: theme.fontSize.md,
    color: theme.colors.info,
  },
});
