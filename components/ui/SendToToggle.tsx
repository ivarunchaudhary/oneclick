import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ms } from '../../utils/responsive';
import FigmaDesignLoader from '../FigmaDesignLoader';
import { figmaConfig } from '../../config/figma.config';
import theme from '../../constants/theme';

/**
 * Get the node ID from your Figma design. You should replace this with
 * the actual node ID from your Figma file.
 */
const SEND_TO_TOGGLE_NODE_ID = '1:4'; // Replace with your actual node ID

type SendToOption = 'myself' | 'accountant';

interface SendToToggleProps {
  onSelect: (option: SendToOption) => void;
  defaultValue?: SendToOption;
  useFigma?: boolean; // Whether to use the Figma design or a local fallback
}

const SendToToggle: React.FC<SendToToggleProps> = ({ 
  onSelect, 
  defaultValue = 'myself',
  useFigma = false
}) => {
  const [selected, setSelected] = useState<SendToOption>(defaultValue);

  const handleSelect = (option: SendToOption) => {
    setSelected(option);
    onSelect(option);
  };

  // Check if we're using Figma designs and if the token is configured
  const canUseFigma = useFigma && figmaConfig.personalAccessToken !== 'YOUR_FIGMA_PERSONAL_ACCESS_TOKEN';
  
  if (canUseFigma) {
    return (
      <View style={styles.figmaContainer}>
        <FigmaDesignLoader nodeId={SEND_TO_TOGGLE_NODE_ID} />
      </View>
    );
  }

  // Fallback local version if Figma is not available or configured
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Send to:</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[
            styles.option, 
            selected === 'myself' && styles.optionSelected
          ]}
          onPress={() => handleSelect('myself')}
        >
          <Text style={[
            styles.optionText,
            selected === 'myself' && styles.optionTextSelected
          ]}>
            Myself
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.option, 
            selected === 'accountant' && styles.optionSelected
          ]}
          onPress={() => handleSelect('accountant')}
        >
          <Text style={[
            styles.optionText,
            selected === 'accountant' && styles.optionTextSelected
          ]}>
            Accountant Group
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  figmaContainer: {
    height: ms(60),
    width: '100%',
    marginVertical: theme.spacing.md,
  },
  container: {
    marginVertical: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: '500',
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: theme.borderRadius.lg,
    padding: ms(4),
  },
  option: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  optionSelected: {
    backgroundColor: theme.colors.primary,
  },
  optionText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.muted,
  },
  optionTextSelected: {
    color: 'white',
  },
});

export default SendToToggle;
