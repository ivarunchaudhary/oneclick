import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import theme from '../constants/theme';
import { fp } from '../utils/responsive';
import FigmaApiClient from '../services/figmaApi';
import { figmaConfig } from '../config/figma.config';

interface FigmaDesignLoaderProps {
  nodeId: string;  // Figma node ID to load
}

const FigmaDesignLoader: React.FC<FigmaDesignLoaderProps> = ({ nodeId }) => {
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDesign = async () => {
      try {
        // Initialize the Figma API client with your personal access token
        const figmaClient = new FigmaApiClient({
          personalAccessToken: figmaConfig.personalAccessToken,
        });

        // Export the specified node as an image
        const result = await figmaClient.exportImages(
          figmaConfig.fileKey,
          {
            ids: [nodeId],
            format: 'png',
            scale: 2, // 2x scale for better resolution on high-DPI screens
          }
        );

        // Get the image URL from the response
        if (result.images && result.images[nodeId]) {
          setImageUrl(result.images[nodeId]);
        } else {
          setError('No image URL returned from Figma');
        }
      } catch (err) {
        setError(`Failed to load design: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDesign();
  }, [nodeId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading design from Figma...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!imageUrl) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No design found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.muted,
  },
  errorText: {
    color: theme.colors.notification,
    fontSize: theme.fontSize.md,
    textAlign: 'center',
  },
});

export default FigmaDesignLoader;
