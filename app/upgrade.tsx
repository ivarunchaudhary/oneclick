import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter } from 'expo-router';
import UpgradeModal from '../components/UpgradeModal';
import theme from '../constants/theme';

export default function UpgradeScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(true);

  const handleClose = () => {
    setModalVisible(false);
    router.back(); // Go back to previous screen
  };

  const handleUpgrade = () => {
    // Handle the upgrade process here
    Alert.alert(
      'Upgrade to Pro',
      'This would normally redirect to payment processing.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          onPress: () => {
            // Here you would integrate with your payment processor
            console.log('Processing upgrade...');
            setModalVisible(false);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <Stack.Screen 
        options={{
          title: 'Upgrade to Pro',
          headerShown: false, // Hide header since we're using a modal
        }} 
      />
      
      <View style={styles.background} />
      
      <UpgradeModal 
        visible={modalVisible}
        onClose={handleClose}
        onUpgrade={handleUpgrade}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  background: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
