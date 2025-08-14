import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FigmaDesignLoader from '../FigmaDesignLoader';
import { figmaConfig } from '../../config/figma.config';
import theme from '../../constants/theme';
import { wp, hp, fp } from '../../utils/responsive';

/**
 * Get the node ID from your Figma design. You should replace this with
 * the actual node ID from your Figma file.
 */
const STATS_CARD_NODE_ID = '1:6'; // Replace with your actual node ID

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: string; // Icon name if using local fallback
  useFigma?: boolean; // Whether to use the Figma design or a local fallback
  backgroundColor?: string; // Background color for the icon
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value,
  icon = "📊",
  useFigma = false,
  backgroundColor = theme.colors.lightBlue
}) => {
  // Check if we're using Figma designs and if the token is configured
  const canUseFigma = useFigma && figmaConfig.personalAccessToken !== 'YOUR_FIGMA_PERSONAL_ACCESS_TOKEN';
  
  if (canUseFigma) {
    return (
      <View style={styles.figmaContainer}>
        <FigmaDesignLoader nodeId={STATS_CARD_NODE_ID} />
      </View>
    );
  }

  // Fallback local version if Figma is not available or configured
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  figmaContainer: {
    height: hp(100),
    flex: 1,
    marginHorizontal: theme.spacing.sm,
    marginVertical: theme.spacing.md,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
    alignItems: 'center',
    marginHorizontal: theme.spacing.sm,
    marginVertical: theme.spacing.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  iconContainer: {
    width: wp(48),
    height: wp(48),
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  icon: {
    fontSize: theme.iconSize.md,
  },
  title: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  value: {
    fontSize: fp(24),
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
});

export default StatsCard;
