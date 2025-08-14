import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Text, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// Import our theme
import theme from '../../constants/theme';
import FigmaDesignLoader from '../../components/FigmaDesignLoader';
import { figmaConfig } from '../../config/figma.config';

/**
 * Get the node ID from your Figma design. You should replace this with
 * the actual node ID from your Figma file.
 */
const HISTORY_SCREEN_NODE_ID = '2:1'; // Replace with your actual node ID

// Sample receipt data for the history screen
const SAMPLE_RECEIPTS = [
  { 
    id: '1',
    date: '5 Aug 2025',
    vendor: 'Grocery Store',
    amount: '₹1,250.00',
    category: 'Groceries',
    status: 'Processed'
  },
  { 
    id: '2',
    date: '3 Aug 2025',
    vendor: 'Electronics Shop',
    amount: '₹8,500.00',
    category: 'Electronics',
    status: 'Pending'
  },
  { 
    id: '3',
    date: '2 Aug 2025',
    vendor: 'Restaurant',
    amount: '₹750.00',
    category: 'Food',
    status: 'Processed'
  },
  { 
    id: '4',
    date: '28 Jul 2025',
    vendor: 'Pharmacy',
    amount: '₹450.00',
    category: 'Healthcare',
    status: 'Processed'
  },
  { 
    id: '5',
    date: '25 Jul 2025',
    vendor: 'Gas Station',
    amount: '₹1,500.00',
    category: 'Transportation',
    status: 'Processed'
  }
];

// Receipt item component
const ReceiptItem: React.FC<{receipt: typeof SAMPLE_RECEIPTS[0]}> = ({ receipt }) => {
  return (
    <View style={styles.receiptItem}>
      <View style={styles.receiptHeader}>
        <Text style={styles.receiptDate}>{receipt.date}</Text>
        <View style={[
          styles.statusTag, 
          {backgroundColor: receipt.status === 'Processed' 
            ? `${theme.colors.primary}20` 
            : '#FEF3C7'}
        ]}>
          <Text style={[
            styles.statusText, 
            {color: receipt.status === 'Processed' 
              ? theme.colors.primary 
              : '#D97706'}
          ]}>
            {receipt.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.receiptContent}>
        <View style={styles.vendorContainer}>
          <MaterialIcons 
            name={getCategoryIcon(receipt.category)} 
            size={theme.iconSize.md} 
            color={theme.colors.primary} 
          />
          <Text style={styles.vendorText}>{receipt.vendor}</Text>
        </View>
        <Text style={styles.amountText}>{receipt.amount}</Text>
      </View>
      
      <View style={styles.receiptFooter}>
        <Text style={styles.categoryText}>{receipt.category}</Text>
      </View>
    </View>
  );
};

// Helper function to get icon based on category
function getCategoryIcon(category: string): keyof typeof MaterialIcons.glyphMap {
  switch (category) {
    case 'Groceries': return 'shopping-cart';
    case 'Electronics': return 'devices';
    case 'Food': return 'restaurant';
    case 'Healthcare': return 'local-hospital';
    case 'Transportation': return 'local-gas-station';
    default: return 'receipt';
  }
}

export default function HistoryScreen() {
  // Whether to use Figma designs (set to true when your node IDs are correct)
  const useFigma = false;
  
  // Check if we're using Figma designs and if the token is configured
  const canUseFigma = useFigma && 
    figmaConfig.personalAccessToken !== 'YOUR_FIGMA_PERSONAL_ACCESS_TOKEN';
    
  if (canUseFigma) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <Stack.Screen 
          options={{
            title: 'Receipt History',
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTintColor: '#fff',
          }} 
        />
        <View style={styles.figmaContainer}>
          <FigmaDesignLoader nodeId={HISTORY_SCREEN_NODE_ID} />
        </View>
      </SafeAreaView>
    );
  }

  // Fallback local version if Figma is not available or configured
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <Stack.Screen 
        options={{
          title: 'Receipt History',
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: '#fff',
        }} 
      />
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Your Receipts</Text>
        <Text style={styles.headerSubtitle}>View and manage your receipt history</Text>
      </View>
      
      <FlatList
        data={SAMPLE_RECEIPTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReceiptItem receipt={item} />}
        contentContainerStyle={styles.listContainer}
      />
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
  headerContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.muted,
  },
  listContainer: {
    padding: theme.spacing.sm,
  },
  receiptItem: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.md,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  receiptDate: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted,
  },
  statusTag: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontSize: theme.fontSize.xs,
    fontWeight: '500',
  },
  receiptContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  vendorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorText: {
    fontSize: theme.fontSize.md,
    fontWeight: '500',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  amountText: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  receiptFooter: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.sm,
  },
  categoryText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted,
  },
});
