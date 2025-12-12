import { Colors } from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const { height, width } = Dimensions.get('window');

interface LoginSuccessAnimationProps {
  onComplete: () => void;
}

// More silly kitten emoji variations!
const kittenEmojis = ['😺', '😸', '😻', '😽', '😹', '🙀', '😿', '😾', '😼'];

// Inspiring fun facts about fostering and helping animals
const funFacts = [
  "🏠 Foster families save 2-3x more lives than shelters alone!",
  "❤️ 90% of fostered pets find their forever homes!",
  "🐱 You're helping reduce shelter overcrowding by 60%!",
  "🌟 Foster pets have a 95% adoption success rate!",
  "💕 Every foster saves an average of 3 animal lives!",
  "🎉 Foster families help 10,000+ pets find homes yearly!",
  "✨ Fostering increases adoption rates by 4x!",
  "🏆 You're part of saving 6.3 million shelter animals!",
  "💪 Foster care reduces euthanasia rates by 70%!",
  "🌈 98% of foster pets become loving companions!",
];

export function LoginSuccessAnimation({ onComplete }: LoginSuccessAnimationProps) {
  const screenSlideY = useSharedValue(height);
  const messageOpacity = useSharedValue(0);
  const messageScale = useSharedValue(0.5);
  const factOpacity = useSharedValue(0);
  const factScale = useSharedValue(0.8);

  const [currentFact] = useState(funFacts[Math.floor(Math.random() * funFacts.length)]);

  // Create more kittens!
  const kittens = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    emoji: kittenEmojis[i % kittenEmojis.length],
    startX: Math.random() * width,
    delay: i * 120,
  }));

  useEffect(() => {
    // Message appears first
    messageOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    messageScale.value = withDelay(600, withSpring(1, { damping: 8, stiffness: 100 }));

    // Fun fact appears
    factOpacity.value = withDelay(1200, withTiming(1, { duration: 500 }));
    factScale.value = withDelay(1200, withSpring(1, { damping: 10, stiffness: 80 }));

    // Screen slides up after longer delay
    screenSlideY.value = withDelay(
      3500,
      withTiming(0, {
        duration: 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );

    // Complete animation and navigate
    const timer = setTimeout(() => {
      onComplete();
    }, 4700);

    return () => clearTimeout(timer);
  }, []);

  const screenStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: screenSlideY.value }],
  }));

  const messageStyle = useAnimatedStyle(() => ({
    opacity: messageOpacity.value,
    transform: [{ scale: messageScale.value }],
  }));

  const factStyle = useAnimatedStyle(() => ({
    opacity: factOpacity.value,
    transform: [{ scale: factScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Floating Kittens */}
      {kittens.map((kitten) => (
        <FloatingKitten
          key={kitten.id}
          emoji={kitten.emoji}
          startX={kitten.startX}
          delay={kitten.delay}
        />
      ))}

      {/* Animated Cat Icons */}
      <AnimatedCatIcon delay={400} startX={width * 0.2} />
      <AnimatedCatIcon delay={800} startX={width * 0.8} />
      <AnimatedCatIcon delay={1200} startX={width * 0.5} />

      {/* Success Message */}
      <Animated.View style={[styles.messageContainer, messageStyle]}>
        <Text style={styles.messageEmoji}>✨</Text>
        <Text style={styles.messageText}>You're Making a Difference!</Text>
        <Text style={styles.messageSubtext}>Loading your dashboard...</Text>
      </Animated.View>

      {/* Fun Fact */}
      <Animated.View style={[styles.factContainer, factStyle]}>
        <Text style={styles.factText}>{currentFact}</Text>
      </Animated.View>

      {/* Sliding Screen Overlay */}
      <Animated.View style={[styles.slideScreen, screenStyle]} />
    </View>
  );
}

interface FloatingKittenProps {
  emoji: string;
  startX: number;
  delay: number;
}

function FloatingKitten({ emoji, startX, delay }: FloatingKittenProps) {
  const translateY = useSharedValue(height + 100);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Float up animation (longer duration)
    translateY.value = withDelay(
      delay,
      withTiming(-200, {
        duration: 3500,
        easing: Easing.out(Easing.cubic),
      })
    );

    // Gentle side-to-side wobble
    translateX.value = withDelay(
      delay,
      withTiming(
        (Math.random() - 0.5) * 80,
        {
          duration: 3500,
          easing: Easing.inOut(Easing.sin),
        }
      )
    );

    // Gentle rotation
    rotate.value = withDelay(
      delay,
      withTiming(
        (Math.random() - 0.5) * 40,
        {
          duration: 3500,
          easing: Easing.inOut(Easing.ease),
        }
      )
    );

    // Slight scale variation
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.1, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        true
      )
    );

    // Fade out near the top
    opacity.value = withDelay(
      delay + 2800,
      withTiming(0, { duration: 700 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: startX + translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.kitten, animatedStyle]}>
      <Text style={styles.kittenEmoji}>{emoji}</Text>
    </Animated.View>
  );
}

interface AnimatedCatIconProps {
  delay: number;
  startX: number;
}

function AnimatedCatIcon({ delay, startX }: AnimatedCatIconProps) {
  const translateY = useSharedValue(height + 50);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(height * 0.3, {
        duration: 2000,
        easing: Easing.out(Easing.back(1.5)),
      })
    );

    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));

    rotate.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(10, { duration: 500 }),
          withTiming(-10, { duration: 500 })
        ),
        -1,
        true
      )
    );

    opacity.value = withDelay(
      delay + 2500,
      withTiming(0, { duration: 500 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: startX },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.catIcon, animatedStyle]}>
      <MaterialCommunityIcons name="cat" size={60} color={Colors.secondary} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  kitten: {
    position: 'absolute',
    bottom: 0,
  },
  kittenEmoji: {
    fontSize: 52,
  },
  catIcon: {
    position: 'absolute',
  },
  messageContainer: {
    alignItems: 'center',
    zIndex: 10,
    marginBottom: 120,
  },
  messageEmoji: {
    fontSize: 70,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  messageSubtext: {
    fontSize: 17,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  factContainer: {
    position: 'absolute',
    bottom: height * 0.25,
    paddingHorizontal: 30,
    alignItems: 'center',
    zIndex: 10,
  },
  factText: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 26,
    backgroundColor: Colors.card,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  slideScreen: {
    position: 'absolute',
    top: height,
    left: 0,
    right: 0,
    height: height,
    backgroundColor: Colors.background,
  },
});
