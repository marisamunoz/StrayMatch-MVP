import { Colors } from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { supabase } from '../../lib/supabase';

// Fun facts for signup
const signupFacts = [
  "🐕 Did you know? Dogs can learn over 1,000 words!",
  "🐱 Cats have been domesticated for over 9,000 years!",
  "❤️ Pets can reduce stress and anxiety by 60%!",
  "🌟 Adopted pets show gratitude for their entire lives!",
  "🏠 Foster families save 3x more lives than shelters!",
  "💕 95% of fostered pets find forever homes!",
  "🎉 You could save up to 10 animals per year by fostering!",
];

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentFact] = useState(signupFacts[Math.floor(Math.random() * signupFacts.length)]);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Signup Failed', error.message);
    } else {
      Alert.alert(
        'Success!',
        'Account created! Please check your email to verify your account.',
        [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
      );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Cute Sleeping Pets with Hearts */}
      <SleepingPets />

      {/* Title */}
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join our community of animal lovers!</Text>

      {/* Fun Fact */}
      <View style={styles.factCard}>
        <Text style={styles.factText}>{currentFact}</Text>
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#94A3B8"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#94A3B8"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#94A3B8"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Already have an account? <Text style={styles.linkBold}>Log in</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function SleepingPets() {
  return (
    <View style={styles.petsContainer}>
      {/* Sleeping Dog */}
      <View style={styles.petWrapper}>
        <MaterialCommunityIcons name="dog" size={70} color={Colors.primary} />
        <Text style={styles.sleepingText}>💤</Text>
        <FloatingHeart delay={0} startX={-10} />
        <FloatingHeart delay={800} startX={5} />
      </View>

      {/* Sleeping Cat */}
      <View style={styles.petWrapper}>
        <MaterialCommunityIcons name="cat" size={70} color={Colors.secondary} />
        <Text style={styles.sleepingText}>💤</Text>
        <FloatingHeart delay={400} startX={-5} />
        <FloatingHeart delay={1200} startX={10} />
      </View>
    </View>
  );
}

interface FloatingHeartProps {
  delay: number;
  startX: number;
}

function FloatingHeart({ delay, startX }: FloatingHeartProps) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0, { duration: 0 }),
          withTiming(-60, { duration: 2000 })
        ),
        -1,
        false
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 200 }),
          withTiming(1, { duration: 1300 }),
          withTiming(0, { duration: 500 })
        ),
        -1,
        false
      )
    );

    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withSpring(1, { damping: 5 }),
          withTiming(1, { duration: 1800 })
        ),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: startX },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.heart, animatedStyle]}>
      <Text style={styles.heartEmoji}>❤️</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  petsContainer: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 24,
    alignItems: 'center',
  },
  petWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  sleepingText: {
    position: 'absolute',
    top: -10,
    right: -15,
    fontSize: 24,
  },
  heart: {
    position: 'absolute',
    top: -20,
  },
  heartEmoji: {
    fontSize: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  factCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#DBEAFE',
    width: '100%',
  },
  factText: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  input: {
    width: '100%',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1E293B', // Dark text color - fixed!
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  button: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.card,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  linkBold: {
    color: Colors.primary,
    fontWeight: '700',
  },
});