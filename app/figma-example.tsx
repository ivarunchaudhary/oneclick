import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
import FigmaDesignLoader from '../components/FigmaDesignLoader';
import { figmaConfig } from '../config/figma.config';

export default function FigmaExampleScreen() {
  const [nodeId, setNodeId] = useState('1:1'); // Default example node ID
  const [loadKey, setLoadKey] = useState(0); // Used to force component reload

  const loadDesign = () => {
    // Force reload of the component by changing the key
    setLoadKey(prevKey => prevKey + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Figma Integration',
          headerStyle: { backgroundColor: '#22C55E' },
          headerTintColor: '#fff',
        }} 
      />
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.heading}>Figma Design Integration</Text>
          <Text style={styles.description}>
            This screen demonstrates loading designs directly from Figma using your personal access token.
          </Text>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Current Configuration:</Text>
            <Text style={styles.infoDetail}>• File Key: {figmaConfig.fileKey}</Text>
            <Text style={styles.infoDetail}>• Token: {figmaConfig.personalAccessToken.substring(0, 8)}...{figmaConfig.personalAccessToken.substring(figmaConfig.personalAccessToken.length - 4)}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter Figma Node ID:</Text>
            <TextInput
              style={styles.input}
              value={nodeId}
              onChangeText={setNodeId}
              placeholder="Enter node ID (e.g. 1:2)"
            />
            <TouchableOpacity 
              style={styles.button} 
              onPress={loadDesign}
            >
              <Text style={styles.buttonText}>Load Design</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.instruction}>
            To find a node ID in Figma:
            {'\n'}1. Right-click an element in Figma
            {'\n'}2. Choose "Copy/Paste as" → "Copy as plugin data"
            {'\n'}3. Look for the "id" property in the JSON data
          </Text>
        </View>
        
        <View style={styles.designContainer}>
          <Text style={styles.designTitle}>Design Preview for Node ID: {nodeId}</Text>
          <FigmaDesignLoader key={loadKey} nodeId={nodeId} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#22C55E',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 16,
  },
  instruction: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 6,
    marginTop: 16,
  },
  infoBox: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  infoText: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  infoDetail: {
    color: '#555',
    fontSize: 14,
    marginBottom: 4,
  },
  inputContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#22C55E',
    borderRadius: 6,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  designContainer: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 300,
  },
  designTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
});
