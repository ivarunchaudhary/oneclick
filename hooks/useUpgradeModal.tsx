import React, { useState } from 'react';
import { Alert } from 'react-native';
import UpgradeModal from '../components/UpgradeModal';

export const useUpgradeModal = () => {
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

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
            hideModal();
            
            // Show success message
            setTimeout(() => {
              Alert.alert('Success!', 'Welcome to One-Click Receipt Pro!');
            }, 500);
          },
        },
      ]
    );
  };

  const UpgradeModalComponent = () => (
    <UpgradeModal 
      visible={visible}
      onClose={hideModal}
      onUpgrade={handleUpgrade}
    />
  );

  return {
    showUpgradeModal: showModal,
    hideUpgradeModal: hideModal,
    UpgradeModalComponent,
  };
};
