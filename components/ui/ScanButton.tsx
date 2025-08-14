import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import theme from '../../constants/theme';
import FigmaDesignLoader from '../FigmaDesignLoader';
import { figmaConfig } from '../../config/figma.config';
import { getButtonHeight } from '../../utils/responsive';

/**
 * Get the node ID from your Figma design. You should replace this with
 * the actual node ID from your Figma file.
 */
const SCAN_BUTTON_NODE_ID = '1:3'; // Replace with your actual node ID

interface ScanButtonProps {
  useFigma?: boolean; // Whether to use the Figma design or a local fallback
}

const ScanButton: React.FC<ScanButtonProps> = ({ useFigma = false }) => {
  const router = useRouter();
  const canUseFigma = useFigma && figmaConfig.personalAccessToken !== 'YOUR_FIGMA_PERSONAL_ACCESS_TOKEN';

  const handleScanPress = () => {
    router.push('/camera');
  };

  if (canUseFigma) {
    return (
      <TouchableOpacity onPress={handleScanPress} style={styles.figmaContainer}>
        <FigmaDesignLoader nodeId={SCAN_BUTTON_NODE_ID} />
      </TouchableOpacity>
    );
  }

  // Fallback local version if Figma is not available or configured
  return (
    <TouchableOpacity style={styles.button} onPress={handleScanPress}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="photo-camera" size={theme.iconSize.md} color="white" />
      </View>
      <Text style={styles.text}>Scan Receipt</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  figmaContainer: {
    height: getButtonHeight(),
    width: '100%',
    marginVertical: theme.spacing.lg,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    marginVertical: theme.spacing.lg,
    ...theme.shadows.md,
    elevation: 3,
    minHeight: getButtonHeight(),
  },
  iconContainer: {
    marginRight: theme.spacing.md,
  },
  text: {
    color: 'white',
    fontSize: theme.fontSize.lg,
    fontWeight: '500',
  },
});

export default ScanButton;
