import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Camera, CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import theme from '../constants/theme';
import { ocrService } from '../services/ocrService';
import { extractReceiptData } from '../utils/receiptParser';
import { wp, hp, fp, ms } from '../utils/responsive';

export default function CameraScreen() {
  const router = useRouter();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState('');
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        await requestPermission();
      }
    })();
  }, [permission, requestPermission]);

  const handleTakePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      setIsProcessing(true);
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });

      if (photo?.uri) {
        await processReceiptImage(photo.uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePickFromGallery = async () => {
    try {
      setIsProcessing(true);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await processReceiptImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processReceiptImage = async (imageUri: string) => {
    try {
      setOcrStatus('Initializing OCR...');
      setOcrProgress(0);
      
      // Extract text using OCR with progress tracking
      const extractedText = await ocrService.extractTextFromImage(imageUri);
      
      setOcrStatus('Processing text...');
      setOcrProgress(80);
      
      if (!extractedText || extractedText.trim().length === 0) {
        Alert.alert('No Text Found', 'Could not extract text from the image. Please try again with a clearer photo.');
        return;
      }

      // Parse receipt data using regex
      const receiptData = extractReceiptData(extractedText);
      
      setOcrStatus('Complete!');
      setOcrProgress(100);
      
      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate to preview screen with extracted data
      router.push({
        pathname: '/receipt-preview',
        params: {
          imageUri,
          extractedText,
          vendor: receiptData.vendor || '',
          date: receiptData.date || '',
          total: receiptData.total || '',
        },
      });
    } catch (error) {
      console.error('Error processing receipt:', error);
      Alert.alert('Processing Error', 'Failed to process the receipt. Please try again.');
    } finally {
      setOcrProgress(0);
      setOcrStatus('');
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.permissionText}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Camera Permission', headerShown: false }} />
        <View style={styles.permissionContainer}>
          <MaterialIcons name="camera-alt" size={ms(64)} color={theme.colors.textSecondary} />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to scan receipts
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Scan Receipt', headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <MaterialIcons name="close" size={theme.iconSize.md} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Receipt</Text>
        <TouchableOpacity style={styles.headerButton} onPress={toggleCameraFacing}>
          <MaterialIcons name="flip-camera-ios" size={theme.iconSize.md} color="white" />
        </TouchableOpacity>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          autofocus="on"
        >
          {/* Camera Overlay */}
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />
            </View>
          </View>
        </CameraView>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Position the receipt within the frame and tap to capture
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={handlePickFromGallery}
          disabled={isProcessing}
        >
          <MaterialIcons name="photo-library" size={theme.iconSize.md} color={theme.colors.primary} />
          <Text style={styles.galleryButtonText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
          onPress={handleTakePicture}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <View style={styles.captureButtonInner} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.flashButton}
          onPress={() => {
            // Flash toggle would go here
            Alert.alert('Flash', 'Flash toggle feature coming soon!');
          }}
          disabled={isProcessing}
        >
          <MaterialIcons name="flash-off" size={theme.iconSize.md} color={theme.colors.textSecondary} />
          <Text style={styles.flashButtonText}>Flash</Text>
        </TouchableOpacity>
      </View>

      {/* Processing Overlay */}
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.processingText}>
              {ocrStatus || 'Processing receipt...'}
            </Text>
            {ocrProgress > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${ocrProgress}%` }]} />
                </View>
                <Text style={styles.progressText}>{ocrProgress}%</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.xl,
  },
  permissionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  permissionText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: fp(22),
  },
  permissionButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  headerButton: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: wp(312), // ~80% of base width
    height: hp(338), // ~40% of base height
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: ms(30),
    height: ms(30),
    borderTopWidth: ms(3),
    borderLeftWidth: ms(3),
    borderColor: theme.colors.primary,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: ms(30),
    height: ms(30),
    borderTopWidth: ms(3),
    borderRightWidth: ms(3),
    borderColor: theme.colors.primary,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: ms(30),
    height: ms(30),
    borderBottomWidth: ms(3),
    borderLeftWidth: ms(3),
    borderColor: theme.colors.primary,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: ms(30),
    height: ms(30),
    borderBottomWidth: ms(3),
    borderRightWidth: ms(3),
    borderColor: theme.colors.primary,
  },
  instructionsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  instructionsText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    textAlign: 'center',
    lineHeight: fp(22),
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  galleryButton: {
    alignItems: 'center',
    width: ms(60),
  },
  galleryButtonText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.xs,
    fontWeight: '500',
  },
  captureButton: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(40),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: ms(4),
    borderColor: theme.colors.primary,
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonInner: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(30),
    backgroundColor: theme.colors.primary,
  },
  flashButton: {
    alignItems: 'center',
    width: ms(60),
  },
  flashButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.xs,
    fontWeight: '500',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingContainer: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    minWidth: ms(220),
  },
  processingText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: theme.spacing.lg,
    width: ms(200),
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: ms(4),
    backgroundColor: theme.colors.borderLight,
    borderRadius: ms(2),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: ms(2),
  },
  progressText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    fontWeight: '500',
  },
});
