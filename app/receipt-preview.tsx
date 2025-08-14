import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as Linking from 'expo-linking';
import theme from '../constants/theme';
import { wp, hp, fp, ms } from '../utils/responsive';
import { formatReceiptForSharing, validateReceiptData, ReceiptData } from '../utils/receiptParser';

// Using responsive utils; no need for Dimensions here

export default function ReceiptPreviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [vendor, setVendor] = useState(params.vendor as string || '');
  const [date, setDate] = useState(params.date as string || '');
  const [total, setTotal] = useState(params.total as string || '');
  const [isSharing, setIsSharing] = useState(false);

  const imageUri = params.imageUri as string;
  const extractedText = params.extractedText as string || '';

  useEffect(() => {
    // Auto-validate when component mounts
    const receiptData: ReceiptData = {
      vendor,
      date,
      total,
      rawText: extractedText,
    };

    const validation = validateReceiptData(receiptData);
    if (!validation.isValid && validation.errors.length > 0) {
      console.log('Validation errors:', validation.errors);
    }
  }, [vendor, date, total, extractedText]);

  const handleShareToWhatsApp = async () => {
    if (!vendor.trim() || !date.trim() || !total.trim()) {
      Alert.alert(
        'Missing Information',
        'Please fill in all fields before sharing.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsSharing(true);

      const receiptData: ReceiptData = {
        vendor: vendor.trim(),
        date: date.trim(),
        total: total.trim(),
        rawText: extractedText,
      };

      const formattedMessage = formatReceiptForSharing(receiptData);
      const encodedMessage = encodeURIComponent(formattedMessage);
      
      // Try to open WhatsApp with the message
      const whatsappUrl = `whatsapp://send?text=${encodedMessage}`;
      
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        // Fallback to regular sharing if WhatsApp is not available
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(formattedMessage, {
            mimeType: 'text/plain',
            dialogTitle: 'Share Receipt',
          });
        } else {
          Alert.alert(
            'Sharing Not Available',
            'WhatsApp is not installed and sharing is not available on this device.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('Error sharing to WhatsApp:', error);
      Alert.alert(
        'Sharing Failed',
        'Could not share the receipt. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSharing(false);
    }
  };

  const handleSave = () => {
    if (!vendor.trim() || !date.trim() || !total.trim()) {
      Alert.alert(
        'Missing Information',
        'Please fill in all fields before saving.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Here you would save to your local database or storage
    Alert.alert(
      'Receipt Saved',
      'Receipt has been saved to your history.',
      [
        {
          text: 'View History',
          onPress: () => {
            router.push('/(tabs)/history');
          },
        },
        {
          text: 'Scan Another',
          onPress: () => {
            router.push('/camera');
          },
        },
        {
          text: 'Done',
          onPress: () => {
            router.push('/');
          },
        },
      ]
    );
  };

  const handleRetake = () => {
    Alert.alert(
      'Retake Photo',
      'Are you sure you want to retake the photo? Your current edits will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Retake',
          style: 'destructive',
          onPress: () => {
            router.replace('/camera');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Receipt Preview',
          headerShown: false,
        }} 
      />

      <KeyboardAwareScrollView 
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'android' ? 100 : 0}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={theme.iconSize.md} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Receipt Preview</Text>
          <TouchableOpacity style={styles.headerButton} onPress={handleRetake}>
            <MaterialIcons name="camera-alt" size={theme.iconSize.md} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Receipt Image Preview */}
          {imageUri && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.receiptImage} />
              <View style={styles.imageOverlay}>
                <MaterialIcons name="check-circle" size={theme.iconSize.md} color={theme.colors.success} />
                <Text style={styles.imageOverlayText}>Photo Captured</Text>
              </View>
            </View>
          )}

          {/* Extracted Data Form */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Review & Edit Receipt Details</Text>
            <Text style={styles.formSubtitle}>
              We've extracted the following information. Please review and edit if needed.
            </Text>

            {/* Vendor Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                <MaterialIcons name="store" size={theme.iconSize.xs} color={theme.colors.primary} />
                {' '}Vendor/Store Name
              </Text>
              <TextInput
                style={styles.textInput}
                value={vendor}
                onChangeText={setVendor}
                placeholder="Enter store name"
                placeholderTextColor={theme.colors.muted}
                autoCapitalize="words"
              />
            </View>

            {/* Date Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                <MaterialIcons name="calendar-today" size={theme.iconSize.xs} color={theme.colors.primary} />
                {' '}Date
              </Text>
              <TextInput
                style={styles.textInput}
                value={date}
                onChangeText={setDate}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={theme.colors.muted}
              />
            </View>

            {/* Total Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                <MaterialIcons name="currency-rupee" size={theme.iconSize.xs} color={theme.colors.primary} />
                {' '}Total Amount
              </Text>
              <TextInput
                style={styles.textInput}
                value={total}
                onChangeText={setTotal}
                placeholder="₹0.00"
                placeholderTextColor={theme.colors.muted}
                keyboardType="numeric"
              />
            </View>

            {/* Raw Text Preview */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                <MaterialIcons name="text-fields" size={theme.iconSize.xs} color={theme.colors.textSecondary} />
                {' '}Extracted Text (Read-only)
              </Text>
              <View style={styles.rawTextContainer}>
                <ScrollView style={styles.rawTextScroll} nestedScrollEnabled>
                  <Text style={styles.rawText}>{extractedText || 'No text extracted'}</Text>
                </ScrollView>
              </View>
            </View>
          </View>

          {/* Preview Card */}
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Receipt Summary</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Vendor:</Text>
                <Text style={styles.previewValue}>{vendor || 'Not specified'}</Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Date:</Text>
                <Text style={styles.previewValue}>{date || 'Not specified'}</Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Total:</Text>
                <Text style={[styles.previewValue, styles.totalValue]}>{total || 'Not specified'}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSave}
          >
            <MaterialIcons name="save" size={theme.iconSize.sm} color="white" />
            <Text style={styles.saveButtonText}>Save Receipt</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={handleShareToWhatsApp}
            disabled={isSharing}
          >
            <MaterialIcons 
              name={isSharing ? "hourglass-empty" : "share"} 
              size={theme.iconSize.sm} 
              color="white" 
            />
            <Text style={styles.shareButtonText}>
              {isSharing ? 'Sharing...' : 'Share to WhatsApp'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  headerButton: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: theme.colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    ...theme.shadows.md,
  },
  receiptImage: {
    width: '100%',
    height: hp(240),
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageOverlayText: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.fontSize.xs,
    fontWeight: '500',
    color: theme.colors.success,
  },
  formContainer: {
    backgroundColor: 'white',
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  formTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  formSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: fp(20),
  },
  fieldContainer: {
    marginBottom: theme.spacing.lg,
  },
  fieldLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  rawTextContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.lightBackground,
    maxHeight: hp(160),
  },
  rawTextScroll: {
    padding: theme.spacing.md,
  },
  rawText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    lineHeight: fp(16),
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  previewContainer: {
    margin: theme.spacing.lg,
    marginTop: 0,
  },
  previewTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  previewCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  previewLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  previewValue: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  totalValue: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.lg,
  },
  actionContainer: {
    padding: theme.spacing.lg,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  saveButton: {
    backgroundColor: theme.colors.textSecondary,
  },
  saveButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
  shareButton: {
    backgroundColor: theme.colors.primary,
  },
  shareButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
});
