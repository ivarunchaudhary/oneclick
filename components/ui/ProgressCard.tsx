import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FigmaDesignLoader from '../FigmaDesignLoader';
import { figmaConfig } from '../../config/figma.config';
import theme from '../../constants/theme';
import { hp, fp } from '../../utils/responsive';

/**
 * Get the node ID from your Figma design. You should replace this with
 * the actual node ID from your Figma file.
 */
const PROGRESS_CARD_NODE_ID = '1:5'; // Replace with your actual node ID

interface ProgressCardProps {
  current: number;
  total: number;
  title: string;
  useFigma?: boolean; // Whether to use the Figma design or a local fallback
}

const ProgressCard: React.FC<ProgressCardProps> = ({ 
  current, 
  total, 
  title = "Today's Receipts",
  useFigma = false
}) => {
  // Calculate completion percentage
  const progress = Math.min(current / total, 1);
  
  // Check if we're using Figma designs and if the token is configured
  const canUseFigma = useFigma && figmaConfig.personalAccessToken !== 'YOUR_FIGMA_PERSONAL_ACCESS_TOKEN';
  
  if (canUseFigma) {
    return (
      <View style={styles.figmaContainer}>
        <FigmaDesignLoader nodeId={PROGRESS_CARD_NODE_ID} />
      </View>
    );
  }

  // Fallback local version if Figma is not available or configured
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.leftSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.progressNumber}>{current}/{total}</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progress * 100}%` }
              ]} 
            />
          </View>
        </View>
        <View style={styles.iconContainer}>
          <MaterialIcons name="receipt-long" size={theme.iconSize.lg} color={theme.colors.primary} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  figmaContainer: {
    height: hp(120),
    width: '100%',
    marginVertical: theme.spacing.md,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
    marginVertical: theme.spacing.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftSection: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.md,
  },
  progressNumber: {
    fontSize: fp(28),
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  progressBar: {
    width: '70%',
    height: hp(6),
    backgroundColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
});

export default ProgressCard;
