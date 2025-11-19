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
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: '80%',
    height: 200,
    alignSelf: 'center',
    marginBottom: 40,
  },
  input: {
    borderWidth: 2,
    borderColor: '#1E90FF',
    padding: 15,
    borderRadius: 50,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 50,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotText: {
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  link: {
    color: '#1E90FF',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  linkBold: {
    fontWeight: 'bold',
  },
});