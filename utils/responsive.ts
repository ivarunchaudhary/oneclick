import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Based on iPhone 12 Pro dimensions (390x844)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Responsive width based on screen size
 * @param size - Size in pixels based on design
 * @returns Scaled width for current device
 */
export const wp = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Responsive height based on screen size
 * @param size - Size in pixels based on design
 * @returns Scaled height for current device
 */
export const hp = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Responsive font size
 * @param size - Font size in pixels
 * @returns Scaled font size for current device
 */
export const fp = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.max(newSize, size * 0.8); // Minimum 80% of original size
};

/**
 * Moderate scale based on width with a configurable factor
 */
export const ms = (size: number, factor = 0.5): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return size + (size * scale - size) * factor;
};

/**
 * Get device type based on screen dimensions
 */
export const getDeviceType = () => {
  const pixelDensity = PixelRatio.get();
  const adjustedWidth = SCREEN_WIDTH * pixelDensity;
  const adjustedHeight = SCREEN_HEIGHT * pixelDensity;

  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return 'tablet';
  } else if (pixelDensity >= 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)) {
    return 'tablet';
  } else {
    return 'phone';
  }
};

/**
 * Check if device is in landscape mode
 */
export const isLandscape = (): boolean => {
  return SCREEN_WIDTH > SCREEN_HEIGHT;
};

/**
 * Get responsive spacing based on device type
 */
export const getResponsiveSpacing = () => {
  const deviceType = getDeviceType();
  const baseSpacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  };

  if (deviceType === 'tablet') {
    return {
      xs: baseSpacing.xs * 1.5,
      sm: baseSpacing.sm * 1.5,
      md: baseSpacing.md * 1.5,
      lg: baseSpacing.lg * 1.5,
      xl: baseSpacing.xl * 1.5,
      xxl: baseSpacing.xxl * 1.5,
    };
  }

  return baseSpacing;
};

/**
 * Get responsive font sizes based on device type
 */
export const getResponsiveFontSizes = () => {
  const deviceType = getDeviceType();
  const baseFonts = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  };

  if (deviceType === 'tablet') {
    return {
      xs: baseFonts.xs * 1.2,
      sm: baseFonts.sm * 1.2,
      md: baseFonts.md * 1.2,
      lg: baseFonts.lg * 1.2,
      xl: baseFonts.xl * 1.2,
      xxl: baseFonts.xxl * 1.2,
    };
  }

  return baseFonts;
};

/**
 * Get responsive icon sizes
 */
export const getResponsiveIconSizes = () => {
  const deviceType = getDeviceType();
  const base = { xs: 16, sm: 20, md: 24, lg: 28, xl: 32 };
  const factor = deviceType === 'tablet' ? 1.1 : 1;
  return {
    xs: Math.round(fp(base.xs) * factor),
    sm: Math.round(fp(base.sm) * factor),
    md: Math.round(fp(base.md) * factor),
    lg: Math.round(fp(base.lg) * factor),
    xl: Math.round(fp(base.xl) * factor),
  };
};

/**
 * Get responsive border radius
 */
export const getResponsiveBorderRadius = () => {
  const deviceType = getDeviceType();
  const baseRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
  };

  if (deviceType === 'tablet') {
    return {
      sm: baseRadius.sm * 1.5,
      md: baseRadius.md * 1.5,
      lg: baseRadius.lg * 1.5,
      xl: baseRadius.xl * 1.5,
      xxl: baseRadius.xxl * 1.5,
    };
  }

  return baseRadius;
};

/**
 * Screen dimensions
 */
export const screenDimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414,
  isTablet: getDeviceType() === 'tablet',
};

/**
 * Responsive container padding based on screen size
 */
export const getContainerPadding = () => {
  if (screenDimensions.isSmallDevice) {
    return 12;
  } else if (screenDimensions.isMediumDevice) {
    return 16;
  } else if (screenDimensions.isTablet) {
    return 32;
  } else {
    return 20;
  }
};

/**
 * Responsive button height
 */
export const getButtonHeight = () => {
  if (screenDimensions.isSmallDevice) {
    return 44;
  } else if (screenDimensions.isTablet) {
    return 56;
  } else {
    return 48;
  }
};

/**
 * Responsive header height
 */
export const getHeaderHeight = () => {
  if (screenDimensions.isTablet) {
    return 80;
  } else {
    return 60;
  }
};
