import { Colors } from '@/constants/Colors';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function StepProgressBar({ currentStep, totalSteps }: StepProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  const animatedStyle = useAnimatedStyle(() => ({
    width: withSpring(`${progress}%`, {
      damping: 15,
      stiffness: 100,
    }),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View style={[styles.progress, animatedStyle]} />
      </View>
      <View style={styles.stepsContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.stepDot,
              index < currentStep && styles.stepDotCompleted,
              index === currentStep - 1 && styles.stepDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  track: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.border,
  },
  stepDotCompleted: {
    backgroundColor: Colors.primary,
  },
  stepDotActive: {
    backgroundColor: Colors.primary,
    transform: [{ scale: 1.3 }],
  },
});
