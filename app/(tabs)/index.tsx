import { View, ScrollView, StyleSheet, SafeAreaView, Alert, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// Import our custom components
import HeaderLogo from '../../components/ui/HeaderLogo';
import ScanButton from '../../components/ui/ScanButton';
import SendToToggle from '../../components/ui/SendToToggle';
import ProgressCard from '../../components/ui/ProgressCard';
import StatsCard from '../../components/ui/StatsCard';
import { useUpgradeModal } from '../../hooks/useUpgradeModal';
import theme from '../../constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { showUpgradeModal, UpgradeModalComponent } = useUpgradeModal();
  // Whether to use Figma designs (set to true when your node IDs are correct)
  const useFigma = false;
  
  // Sample data for the app (this would come from your actual data store in a real app)
  const todaysReceipts = {
    current: 3,
    total: 10
  };
  
  const stats = {
    thisMonth: 24,
    totalSaved: '₹12,450'
  };
  

  
  const handleSendToSelect = (option: 'myself' | 'accountant') => {
    console.log(`Selected send to: ${option}`);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <Stack.Screen 
        options={{
          headerShown: false
        }} 
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <HeaderLogo useFigma={useFigma} />
        </View>
        
        {/* Main content */}
        <View style={styles.scanSection}>
          {/* Scan Button */}
          <ScanButton useFigma={useFigma} />
          
          {/* Send To Toggle */}
          <SendToToggle onSelect={handleSendToSelect} useFigma={useFigma} />
        </View>
        
        {/* Progress Card */}
        <View style={styles.section}>
          <ProgressCard 
            current={todaysReceipts.current}
            total={todaysReceipts.total}
            title="Today's Receipts"
            useFigma={useFigma}
          />
        </View>
        
        {/* Upgrade to Pro Card */}
        <TouchableOpacity 
          style={styles.upgradeCard} 
          onPress={showUpgradeModal}
        >
          <MaterialIcons name="workspace-premium" size={theme.iconSize.md} color={theme.colors.textSecondary} />
          <Text style={styles.upgradeText}>Upgrade to Pro</Text>
        </TouchableOpacity>
        
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <StatsCard 
            title="This Month"
            value={stats.thisMonth}
            icon="📅"
            backgroundColor={theme.colors.lightBlue}
            useFigma={useFigma}
          />
          <StatsCard 
            title="Total Saved"
            value={stats.totalSaved}
            icon="₹"
            backgroundColor={theme.colors.lightPurple}
            useFigma={useFigma}
          />
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.sm,
  },
  header: {
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  section: {
    marginVertical: theme.spacing.xs,
  },
  scanSection: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.sm,
  },
  upgradeCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  upgradeText: {
    fontSize: theme.fontSize.md,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
});
