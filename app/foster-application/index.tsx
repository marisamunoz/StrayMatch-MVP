import { LoadingAnimation } from '@/components/ui/LoadingAnimation';
import { SelectableChip } from '@/components/ui/SelectableChip';
import { StepProgressBar } from '@/components/ui/StepProgressBar';
import { BorderRadius, Colors, Shadows } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

export default function FosterApplicationScreen() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Form state
  const [homeType, setHomeType] = useState<'house' | 'apartment' | 'condo' | 'other' | null>(null);
  const [hasYard, setHasYard] = useState<boolean | null>(null);
  const [hasOtherPets, setHasOtherPets] = useState<boolean | null>(null);
  const [petExperience, setPetExperience] = useState('');
  const [preferredSpecies, setPreferredSpecies] = useState<string[]>([]);
  const [preferredSize, setPreferredSize] = useState<string[]>([]);
  const [maxAnimals, setMaxAnimals] = useState(1);
  const [references, setReferences] = useState('');
  const [hasCriminalHistory, setHasCriminalHistory] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');  
  const [address, setAddress] = useState('');

  // Show cute loading animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const toggleSpecies = (species: string) => {
    Haptics.selectionAsync();
    if (preferredSpecies.includes(species)) {
      setPreferredSpecies(preferredSpecies.filter(s => s !== species));
    } else {
      setPreferredSpecies([...preferredSpecies, species]);
    }
  };

  const toggleSize = (size: string) => {
    Haptics.selectionAsync();
    if (preferredSize.includes(size)) {
      setPreferredSize(preferredSize.filter(s => s !== size));
    } else {
      setPreferredSize([...preferredSize, size]);
    }
  };

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1) {
      if (!homeType || hasYard === null) {
        Alert.alert('Required Fields', 'Please complete all household information');
        return;
      }
    } else if (currentStep === 2) {
      if (!petExperience.trim()) {
        Alert.alert('Required Field', 'Please share your pet experience');
        return;
      }
    } else if (currentStep === 3) {
      if (preferredSpecies.length === 0) {
        Alert.alert('Required Field', 'Please select at least one preferred species');
        return;
      }
    } else if (currentStep === 4) {
      if (hasCriminalHistory === null || hasOtherPets === null) {
        Alert.alert('Required Fields', 'Please answer all questions');
        return;
      }
    }

    if (currentStep < totalSteps) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'You must be logged in');
        return;
      }

      const { error } = await supabase
        .from('foster_applications')
        .insert([{
          user_id: user.id,
          full_name: fullName,
          phoneNumber: phoneNumber,
          address: address,
          home_type: homeType,
          has_yard: hasYard,
          has_other_pets: hasOtherPets,
          pet_experience: petExperience,
          preferred_species: preferredSpecies,
          preferred_size: preferredSize,
          max_animals: maxAnimals,
          references: references,
          has_criminal_history: hasCriminalHistory ?? false,
          status: 'pending',
        }])
        .select();

      if (error) throw error;

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Success! 🎉',
        'Your foster application has been submitted. We\'ll review it and contact you soon!',
        [{ text: 'OK', onPress: () => router.push('/') }]
      );

    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Animated.View 
            entering={FadeInRight.springify()}
            exiting={FadeOutLeft.springify()}
            style={styles.stepContainer}
          >
            <Text style={styles.stepTitle}>Household Information</Text>
            <Text style={styles.stepSubtitle}>Tell us about your living situation</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Home Type *</Text>
              <View style={styles.chipGroup}>
                <SelectableChip
                  label="House"
                  selected={homeType === 'house'}
                  onPress={() => setHomeType('house')}
                />
                <SelectableChip
                  label="Apartment"
                  selected={homeType === 'apartment'}
                  onPress={() => setHomeType('apartment')}
                />
                <SelectableChip
                  label="Condo"
                  selected={homeType === 'condo'}
                  onPress={() => setHomeType('condo')}
                />
                <SelectableChip
                  label="Other"
                  selected={homeType === 'other'}
                  onPress={() => setHomeType('other')}
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Do you have a yard? *</Text>
              <View style={styles.chipGroup}>
                <SelectableChip
                  label="Yes"
                  selected={hasYard === true}
                  onPress={() => setHasYard(true)}
                />
                <SelectableChip
                  label="No"
                  selected={hasYard === false}
                  onPress={() => setHasYard(false)}
                />
              </View>
            </View>
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View 
            entering={FadeInRight.springify()}
            exiting={FadeOutLeft.springify()}
            style={styles.stepContainer}
          >
            <Text style={styles.stepTitle}>Pet Experience</Text>
            <Text style={styles.stepSubtitle}>Share your experience with animals</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Tell us about your pet experience *</Text>
              <TextInput
                style={styles.textArea}
                value={petExperience}
                onChangeText={setPetExperience}
                placeholder="Share your experience with pets, including any training or care you've provided..."
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>References (Optional)</Text>
              <TextInput
                style={styles.textArea}
                value={references}
                onChangeText={setReferences}
                placeholder="Provide 2-3 references (name, phone, relationship)..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View 
            entering={FadeInRight.springify()}
            exiting={FadeOutLeft.springify()}
            style={styles.stepContainer}
          >
            <Text style={styles.stepTitle}>Preferences</Text>
            <Text style={styles.stepSubtitle}>What type of animals would you like to foster?</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Preferred Species *</Text>
              <View style={styles.chipGroup}>
                <SelectableChip
                  label="Dog"
                  selected={preferredSpecies.includes('dog')}
                  onPress={() => toggleSpecies('dog')}
                />
                <SelectableChip
                  label="Cat"
                  selected={preferredSpecies.includes('cat')}
                  onPress={() => toggleSpecies('cat')}
                />
                <SelectableChip
                  label="Either"
                  selected={preferredSpecies.includes('either')}
                  onPress={() => toggleSpecies('either')}
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Preferred Size (Optional)</Text>
              <View style={styles.chipGroup}>
                <SelectableChip
                  label="Small"
                  selected={preferredSize.includes('small')}
                  onPress={() => toggleSize('small')}
                />
                <SelectableChip
                  label="Medium"
                  selected={preferredSize.includes('medium')}
                  onPress={() => toggleSize('medium')}
                />
                <SelectableChip
                  label="Large"
                  selected={preferredSize.includes('large')}
                  onPress={() => toggleSize('large')}
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Maximum animals you can foster</Text>
              <View style={styles.chipGroup}>
                {[1, 2, 3, 4, 5].map(num => (
                  <SelectableChip
                    key={num}
                    label={num.toString()}
                    selected={maxAnimals === num}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setMaxAnimals(num);
                    }}
                  />
                ))}
              </View>
            </View>
          </Animated.View>
        );

      case 4:
        return (
          <Animated.View 
            entering={FadeInRight.springify()}
            exiting={FadeOutLeft.springify()}
            style={styles.stepContainer}
          >
            <Text style={styles.stepTitle}>Background Check</Text>
            <Text style={styles.stepSubtitle}>Final questions before submission</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Do you have other pets? *</Text>
              <View style={styles.chipGroup}>
                <SelectableChip
                  label="Yes"
                  selected={hasOtherPets === true}
                  onPress={() => setHasOtherPets(true)}
                />
                <SelectableChip
                  label="No"
                  selected={hasOtherPets === false}
                  onPress={() => setHasOtherPets(false)}
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Have you ever been accused of, arrested, or convicted of animal cruelty and/or family violence? *
              </Text>
              <View style={styles.chipGroup}>
                <SelectableChip
                  label="Yes"
                  selected={hasCriminalHistory === true}
                  onPress={() => setHasCriminalHistory(true)}
                />
                <SelectableChip
                  label="No"
                  selected={hasCriminalHistory === false}
                  onPress={() => setHasCriminalHistory(false)}
                />
              </View>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Application Summary</Text>
              <Text style={styles.summaryText}>• Home: {homeType || 'Not specified'}</Text>
              <Text style={styles.summaryText}>• Yard: {hasYard ? 'Yes' : 'No'}</Text>
              <Text style={styles.summaryText}>• Species: {preferredSpecies.join(', ') || 'Not specified'}</Text>
              <Text style={styles.summaryText}>• Max Animals: {maxAnimals}</Text>
            </View>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  // Show cute loading animation on initial load
  if (initialLoading) {
    return <LoadingAnimation message="Preparing your application..." showFunFact={true} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Foster Application</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <StepProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <Text style={styles.stepIndicator}>
          Step {currentStep} of {totalSteps}
        </Text>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStep()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {currentStep < totalSteps ? (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.card} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.card,
    ...Shadows.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.card,
  },
  stepIndicator: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  fieldContainer: {
    marginBottom: 28,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    lineHeight: 22,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  textArea: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: 16,
    fontSize: 15,
    minHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
  },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: 20,
    marginTop: 16,
    ...Shadows.md,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 22,
  },
  navigationContainer: {
    padding: 24,
    backgroundColor: Colors.card,
    ...Shadows.lg,
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadows.md,
  },
  nextButtonText: {
    color: Colors.card,
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: Colors.success,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    ...Shadows.md,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.textSecondary,
  },
  submitButtonText: {
    color: Colors.card,
    fontSize: 18,
    fontWeight: 'bold',
  },
  nameArea: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 10,
    textAlignVertical: 'top',
  },
});