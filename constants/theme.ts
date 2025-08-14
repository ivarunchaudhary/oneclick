import { StyleSheet } from 'react-native';
import { getResponsiveSpacing, getResponsiveFontSizes, getResponsiveBorderRadius, getResponsiveIconSizes } from '../utils/responsive';

const responsiveSpacing = getResponsiveSpacing();
const responsiveFonts = getResponsiveFontSizes();
const responsiveBorderRadius = getResponsiveBorderRadius();
const responsiveIconSizes = getResponsiveIconSizes();

export default {
  colors: {
    primary: '#22C55E',    // Main green color
    primaryLight: '#34D399', // Lighter green
    background: '#F7F8FA',
    card: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    notification: '#EF4444',
    shadow: 'rgba(0,0,0,0.08)',
    muted: '#9CA3AF',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
    lightGreen: '#ECFDF5',
    lightBlue: '#EFF6FF',
    lightPurple: '#F3E8FF',
    lightOrange: '#FFF7ED',
    lightBackground: '#F8FAFC',
  },
  spacing: responsiveSpacing,
  borderRadius: responsiveBorderRadius,
  fontSize: responsiveFonts,
  iconSize: responsiveIconSizes,
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};
