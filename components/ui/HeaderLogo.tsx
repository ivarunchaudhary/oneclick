import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ms } from '../../utils/responsive';
import FigmaDesignLoader from '../../components/FigmaDesignLoader';
import { figmaConfig } from '../../config/figma.config';
import theme from '../../constants/theme';

/**
 * Get the node ID from your Figma design. You should replace this with
 * the actual node ID from your Figma file.
 */
const HEADER_LOGO_NODE_ID = '1:2'; // Replace with your actual node ID

interface HeaderLogoProps {
  useFigma?: boolean; // Whether to use the Figma design or a local fallback
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ useFigma = false }) => {
  // Check if we're using Figma designs and if the token is configured
  const canUseFigma = useFigma && figmaConfig.personalAccessToken !== 'YOUR_FIGMA_PERSONAL_ACCESS_TOKEN';
  
  if (canUseFigma) {
    return (
      <View style={styles.figmaContainer}>
        <FigmaDesignLoader nodeId={HEADER_LOGO_NODE_ID} />
      </View>
    );
  }

  // Fallback local version if Figma is not available or configured
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <MaterialIcons name="receipt-long" size={theme.iconSize.md} color="white" />
        </View>
      </View>
      <Text style={styles.title}>One-Click Receipt</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    justifyContent: 'center',
  },
  figmaContainer: {
    height: ms(60),
    justifyContent: 'center',
  },
  logoContainer: {
    marginRight: theme.spacing.md,
  },
  logo: {
    width: ms(48),
    height: ms(48),
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.text,
    fontStyle: 'italic',
  },
});

export default HeaderLogo;
