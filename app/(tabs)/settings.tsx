import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Text, Switch, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// Import our theme
import theme from '../../constants/theme';
import { wp, hp, fp } from '../../utils/responsive';
import FigmaDesignLoader from '../../components/FigmaDesignLoader';
import { figmaConfig } from '../../config/figma.config';
import { useUpgradeModal } from '../../hooks/useUpgradeModal';

/**
 * Get the node ID from your Figma design. You should replace this with
 * the actual node ID from your Figma file.
 */
const SETTINGS_SCREEN_NODE_ID = '3:1'; // Replace with your actual node ID

// Setting item with toggle component
interface ToggleSettingProps {
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const ToggleSetting: React.FC<ToggleSettingProps> = ({ 
  title, 
  description, 
  value, 
  onValueChange,
  icon 
}) => {
  return (
    <View style={styles.settingItem}>
      <View style={styles.settingIconContainer}>
        <MaterialIcons name={icon} size={theme.iconSize.md} color={theme.colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E2E8F0', true: `${theme.colors.primary}80` }}
        thumbColor={value ? theme.colors.primary : '#f4f3f4'}
      />
    </View>
  );
};

// Setting item for navigation
interface NavigationSettingProps {
  title: string;
  description?: string;
  onPress: () => void;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const NavigationSetting: React.FC<NavigationSettingProps> = ({
  title,
  description,
  onPress,
  icon
}) => {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIconContainer}>
        <MaterialIcons name={icon} size={theme.iconSize.md} color={theme.colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      <MaterialIcons name="chevron-right" size={24} color={theme.colors.muted} />
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const router = useRouter();
  const { showUpgradeModal, UpgradeModalComponent } = useUpgradeModal();
  // Whether to use Figma designs (set to true when your node IDs are correct)
  const useFigma = false;
  
  // State for toggle settings
  const [autoSync, setAutoSync] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  
  // Check if we're using Figma designs and if the token is configured
  const canUseFigma = useFigma && 
    figmaConfig.personalAccessToken !== 'YOUR_FIGMA_PERSONAL_ACCESS_TOKEN';
    
  if (canUseFigma) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <Stack.Screen 
          options={{
            title: 'Settings',
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTintColor: '#fff',
          }} 
        />
        <View style={styles.figmaContainer}>
          <FigmaDesignLoader nodeId={SETTINGS_SCREEN_NODE_ID} />
        </View>
      </SafeAreaView>
    );
  }

  // Handler for navigation settings
  const handleNavigation = (screen: string) => {
    console.log(`Navigate to ${screen}`);
    // Implementation would use router.push() to navigate
  };

  // Fallback local version if Figma is not available or configured
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <Stack.Screen 
        options={{
          title: 'Settings',
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: '#fff',
        }} 
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Daily Scan Limit */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Scan Limit</Text>
          <View style={styles.sectionContent}>
            <View style={styles.limitCard}>
              <View style={styles.limitHeader}>
                <Text style={styles.limitTitle}>Free plan: 3/10 scans used today</Text>
                <TouchableOpacity style={styles.refreshButton}>
                  <MaterialIcons name="refresh" size={theme.iconSize.sm} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={styles.progressFill} />
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.unlimitedButton}
                onPress={showUpgradeModal}
              >
                <MaterialIcons name="all-inclusive" size={20} color={theme.colors.primary} />
                <Text style={styles.unlimitedText}>Get Unlimited Scans</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Auto-send to WhatsApp */}
        <View style={styles.settingItemContainer}>
          <View style={styles.settingItem}>
            <View style={styles.whatsappIconContainer}>
              <MaterialIcons name="chat" size={theme.iconSize.md} color="#25D366" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Auto-send to WhatsApp</Text>
              <Text style={styles.settingDescription}>Send receipts automatically after scanning</Text>
            </View>
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              trackColor={{ false: '#E2E8F0', true: `${theme.colors.primary}80` }}
              thumbColor={autoSync ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
        </View>
        
        {/* Default WhatsApp Contact */}
        <View style={styles.settingItemContainer}>
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleNavigation('whatsapp-contact')}
          >
            <View style={styles.personIconContainer}>
              <MaterialIcons name="person" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Default WhatsApp Contact</Text>
              <Text style={styles.settingDescription}>Myself</Text>
            </View>
            <MaterialIcons name="chevron-right" size={theme.iconSize.md} color={theme.colors.muted} />
          </TouchableOpacity>
        </View>
        
        {/* Restore Purchases */}
        <View style={styles.settingItemContainer}>
          <View style={styles.settingItem}>
            <View style={styles.restoreIconContainer}>
              <MaterialIcons name="restore" size={theme.iconSize.md} color="#F59E0B" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Restore Purchases</Text>
              <Text style={styles.settingDescription}>Restore your Pro subscription</Text>
            </View>
            <TouchableOpacity style={styles.restoreButton}>
              <Text style={styles.restoreButtonText}>Restore</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Data & Privacy */}
        <View style={styles.settingItemContainer}>
          <View style={styles.settingItem}>
            <View style={[styles.privacyIconContainer, { width: wp(40), height: wp(40) }]}>
              <MaterialIcons name="security" size={theme.iconSize.md} color={theme.colors.textSecondary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Data & Privacy</Text>
            </View>
          </View>
          
          <View style={styles.privacyLinksContainer}>
            <TouchableOpacity style={styles.privacyLinkItem}>
              <Text style={styles.privacyLinkText}>Privacy Policy</Text>
              <MaterialIcons name="open-in-new" size={theme.iconSize.xs} color={theme.colors.muted} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.privacyLinkItem}>
              <Text style={styles.privacyLinkText}>Terms of Service</Text>
              <MaterialIcons name="open-in-new" size={theme.iconSize.xs} color={theme.colors.muted} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.privacyLinkItem}>
              <Text style={styles.privacyLinkText}>Delete Account</Text>
              <MaterialIcons name="open-in-new" size={theme.iconSize.xs} color={theme.colors.muted} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Upgrade to Pro */}
        <View style={styles.upgradeSection}>
          <View style={styles.upgradeIcon}>
            <MaterialIcons name="workspace-premium" size={theme.iconSize.xl} color={theme.colors.warning} />
          </View>
          <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
          <Text style={styles.upgradeSubtitle}>Get unlimited scans, remove ads, and unlock premium features</Text>
          
          <TouchableOpacity 
            style={styles.upgradeButton}
            onPress={showUpgradeModal}
          >
            <MaterialIcons name="workspace-premium" size={theme.iconSize.sm} color="white" />
            <Text style={styles.upgradeButtonText}>Get Pro - ₹159</Text>
          </TouchableOpacity>
        </View>
        
        {/* App version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>One-Click Receipt</Text>
          <Text style={styles.versionNumber}>Version 1.7.5</Text>
        </View>
      </ScrollView>
      
      {/* Upgrade Modal */}
      <UpgradeModalComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  figmaContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginVertical: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  sectionContent: {
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '500',
    color: theme.colors.text,
  },
  settingDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted,
    marginTop: 2,
  },
  limitSection: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  limitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  limitTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
  },
  refreshButton: {
    padding: theme.spacing.xs,
  },
  limitSubtitle: {
    fontSize: 14,
    color: theme.colors.muted,
    marginBottom: theme.spacing.md,
  },
  unlimitedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  unlimitedText: {
    fontSize: theme.fontSize.md,
    fontWeight: '500',
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  privacySection: {
    backgroundColor: theme.colors.card,
  },
  privacyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  privacyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  upgradeSection: {
    backgroundColor: theme.colors.lightOrange,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  upgradeIcon: {
    width: wp(60),
    height: wp(60),
    borderRadius: Math.round(wp(60) / 2),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  upgradeTitle: {
    fontSize: fp(20),
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  upgradeSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  versionText: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  versionNumber: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted,
  },
  // New styles for exact layout match
  limitCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  refreshIconButton: {
    padding: theme.spacing.xs,
    backgroundColor: theme.colors.lightBlue,
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    marginVertical: theme.spacing.sm,
  },
  progressBar: {
    width: '100%',
    height: hp(6),
    backgroundColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    width: '30%', // 3/10 = 30%
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  settingItemContainer: {
    backgroundColor: 'white',
    marginVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  whatsappIconContainer: {
    width: wp(40),
    height: wp(40),
    borderRadius: Math.round(wp(40) / 2),
    backgroundColor: '#E8F5E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  personIconContainer: {
    width: wp(40),
    height: wp(40),
    borderRadius: Math.round(wp(40) / 2),
    backgroundColor: theme.colors.lightPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  restoreIconContainer: {
    width: wp(40),
    height: wp(40),
    borderRadius: Math.round(wp(40) / 2),
    backgroundColor: theme.colors.lightOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  restoreButton: {
    backgroundColor: theme.colors.borderLight,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  restoreButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  privacyIconContainer: {
    width: wp(40),
    height: wp(40),
    borderRadius: Math.round(wp(40) / 2),
    backgroundColor: theme.colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  privacyLinksContainer: {
    marginLeft: wp(54), // Align with main setting content
    paddingBottom: theme.spacing.md,
  },
  privacyLinkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  privacyLinkText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
});
