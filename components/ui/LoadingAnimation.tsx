import { Colors } from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const funFacts = [
  "🐕 Dogs can understand up to 250 words and gestures!",
  "🐈 Cats spend 70% of their lives sleeping - that's 13-16 hours a day!",
  "🐾 A dog's sense of smell is 10,000 to 100,000 times stronger than humans!",
  "😺 Cats have over 20 different vocalizations, including the purr!",
  "🐕 Dogs dream just like humans - watch their paws twitch!",
  "🐈 A group of cats is called a 'clowder'!",
  "❤️ Petting a dog or cat can lower your blood pressure!",
  "🐾 Dogs' noses are as unique as human fingerprints!",
  "😸 Cats can rotate their ears 180 degrees!",
  "🐕 A wagging tail doesn't always mean a happy dog - watch the speed!",
  "🐈 Cats can jump up to 6 times their length!",
  "🌟 Adopting a pet can add years to your life!",
  "🐾 Dogs can learn over 1,000 words with proper training!",
  "😺 Cats have a third eyelid called a 'haw'!",
  "❤️ Rescue animals often make the most loyal companions!",
];

interface LoadingAnimationProps {
  message?: string;
  showFunFact?: boolean;
}

export function LoadingAnimation({ 
  message = "Loading...", 
  showFunFact = true 
}: LoadingAnimationProps) {
  const [currentFact, setCurrentFact] = useState(
    funFacts[Math.floor(Math.random() * funFacts.length)]
  );

  // Animation values
  const dogPosition = useSharedValue(0);
  const catPosition = useSharedValue(0);
  const dogRotation = useSharedValue(0);
  const catRotation = useSharedValue(0);
  const pawScale = useSharedValue(1);
  const heartScale = useSharedValue(0);

  useEffect(() => {
    // Dog bouncing animation
    dogPosition.value = withRepeat(
      withSequence(
        withSpring(-20, { damping: 2, stiffness: 80 }),
        withSpring(0, { damping: 2, stiffness: 80 })
      ),
      -1,
      false
    );

    // Cat bouncing animation (offset timing)
    setTimeout(() => {
      catPosition.value = withRepeat(
        withSequence(
          withSpring(-20, { damping: 2, stiffness: 80 }),
          withSpring(0, { damping: 2, stiffness: 80 })
        ),
        -1,
        false
      );
    }, 400);

    // Dog tail wag (rotation)
    dogRotation.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 200 }),
        withTiming(-10, { duration: 200 }),
        withTiming(0, { duration: 200 })
      ),
      -1,
      false
    );

    // Cat tail wag
    catRotation.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 250 }),
        withTiming(10, { duration: 250 }),
        withTiming(0, { duration: 250 })
      ),
      -1,
      false
    );

    // Paw prints pulsing
    pawScale.value = withRepeat(
      withSequence(
        withSpring(1.2, { damping: 2 }),
        withSpring(1, { damping: 2 })
      ),
      -1,
      false
    );

    // Hearts appearing
    heartScale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0, { duration: 800 })
      ),
      -1,
      false
    );

    // Rotate fun facts every 4 seconds
    const factInterval = setInterval(() => {
      setCurrentFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
    }, 4000);

    return () => clearInterval(factInterval);
  }, []);

  const dogStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: dogPosition.value },
      { rotate: `${dogRotation.value}deg` },
    ],
  }));

  const catStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: catPosition.value },
      { rotate: `${catRotation.value}deg` },
    ],
  }));

  const pawStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pawScale.value }],
  }));

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartScale.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        {/* Floating hearts */}
        <Animated.View style={[styles.heart, styles.heartLeft, heartStyle]}>
          <Text style={styles.heartEmoji}>❤️</Text>
        </Animated.View>
        <Animated.View style={[styles.heart, styles.heartRight, heartStyle]}>
          <Text style={styles.heartEmoji}>💙</Text>
        </Animated.View>

        {/* Animated characters */}
        <View style={styles.charactersContainer}>
          <Animated.View style={[styles.character, dogStyle]}>
            <MaterialCommunityIcons name="dog" size={80} color={Colors.primary} />
          </Animated.View>
          
          <Animated.View style={[styles.pawPrint, pawStyle]}>
            <MaterialCommunityIcons name="paw" size={40} color={Colors.secondary} />
          </Animated.View>

          <Animated.View style={[styles.character, catStyle]}>
            <MaterialCommunityIcons name="cat" size={80} color={Colors.secondary} />
          </Animated.View>
        </View>

        {/* Loading message */}
        <Text style={styles.loadingText}>{message}</Text>

        {/* Loading dots */}
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, pawStyle]} />
          <Animated.View style={[styles.dot, { opacity: 0.7 }]} />
          <Animated.View style={[styles.dot, { opacity: 0.4 }]} />
        </View>
      </View>

      {/* Fun fact */}
      {showFunFact && (
        <View style={styles.funFactContainer}>
          <Text style={styles.funFactLabel}>Did you know?</Text>
          <Text style={styles.funFactText}>{currentFact}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  animationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  charactersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 24,
  },
  character: {
    alignItems: 'center',
  },
  pawPrint: {
    marginTop: 20,
  },
  heart: {
    position: 'absolute',
    top: -20,
  },
  heartLeft: {
    left: 40,
  },
  heartRight: {
    right: 40,
  },
  heartEmoji: {
    fontSize: 32,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  funFactContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  funFactLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  funFactText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    textAlign: 'center',
  },
});
