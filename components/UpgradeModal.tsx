import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import theme from '../constants/theme';
import { ms, fp } from '../utils/responsive';

interface UpgradeModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ visible, onClose, onUpgrade }) => {
  const features = [
    'Unlimited daily scans',
    'Remove all advertisements', 
    'Monthly CSV export',
    'Advanced analytics',
    'Priority customer support'
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={theme.iconSize.md} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Crown Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.crownBackground}>
                <MaterialIcons name="workspace-premium" size={theme.iconSize.lg} color="white" />
              </View>
            </View>
            
            {/* Title */}
            <Text style={styles.title}>One-Click Receipt Pro</Text>
            
            {/* Pricing */}
            <Text style={styles.pricing}>₹159 / $1.99</Text>
            
            {/* Features List */}
            <View style={styles.featuresContainer}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.checkIconContainer}>
                    <MaterialIcons name="check" size={16} color={theme.colors.primary} />
                  </View>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            
            {/* Upgrade Button */}
            <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade}>
              <MaterialIcons name="workspace-premium" size={theme.iconSize.sm} color="white" />
              <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
            </TouchableOpacity>
            
            {/* Maybe Later */}
            <TouchableOpacity style={styles.maybeLaterButton} onPress={onClose}>
              <Text style={styles.maybeLaterText}>Maybe Later</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    width: '100%',
    maxWidth: ms(420),
    maxHeight: '80%',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    zIndex: 1,
    padding: theme.spacing.xs,
    backgroundColor: theme.colors.borderLight,
    borderRadius: ms(20),
    width: ms(32),
    height: ms(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  crownBackground: {
    width: ms(64),
    height: ms(64),
    borderRadius: ms(32),
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  pricing: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  featuresContainer: {
    marginBottom: theme.spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  checkIconContainer: {
    width: ms(24),
    height: ms(24),
    borderRadius: ms(12),
    backgroundColor: `${theme.colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  featureText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    flex: 1,
    fontWeight: '400',
  },
  upgradeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
  maybeLaterButton: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  maybeLaterText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
});

export default UpgradeModal;
