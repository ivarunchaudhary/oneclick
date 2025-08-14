import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../constants/theme';

interface GradientBackgroundProps {
  children: React.ReactNode;
  colors?: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: any;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ 
  children, 
  colors = [theme.colors.background, '#F0F9FF'], 
  start = { x: 0, y: 0 },
  end = { x: 0, y: 1 },
  style 
}) => {
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={[styles.gradient, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default GradientBackground;
