import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Login Failed', error.message);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/StrayMatchLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Phone Number, Username or Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Loading...' : 'Log In'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/signup')}>
        <Text style={styles.link}>Don't have an account? <Text style={styles.linkBold}>Sign Up</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    fontSize: 16,
    color: '#1E90FF', // YOUR BLUE ✅
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  
  // Initial Screen Styles
  initialContainer: {
    flex: 1,
  },
  availableBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 30,
  },
  availableText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  
  // Quick Actions
  quickActionsSection: {
    marginBottom: 40,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  quickActionsGrid: {
    gap: 16,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E6F3FF', // LIGHT BLUE BACKGROUND ✅
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  quickActionLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  
  // Initial AI Message
  initialMessageContainer: {
    marginTop: 20,
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E90FF', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiAvatarText: {
    fontSize: 20,
  },
  initialMessageBubble: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    marginBottom: 8,
  },
  initialMessageText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginLeft: 8,
  },

  // Chat Messages
  messageBubble: {
    maxWidth: '80%',
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#1E90FF', 
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F5F5',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: '#333',
  },
  typingText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
  },

  // Input Bar
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    maxHeight: 100,
    marginRight: 12,
    color: '#333',
  },
  sendButtonIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E90FF', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    fontSize: 20,
  },
});