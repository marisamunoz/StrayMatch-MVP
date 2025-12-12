import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function FosterApplicationScreen() {
  // Form state
  const [homeType, setHomeType] = useState<'house' | 'apartment' | 'condo' | 'other' | null>(null);
  const [hasYard, setHasYard] = useState<boolean | null>(null);
  const [hasOtherPets, setHasOtherPets] = useState<boolean | null>(null);
  const [petExperience, setPetExperience] = useState('');
  const [preferredSpecies, setPreferredSpecies] = useState<string[]>([]);
  const [preferredSize, setPreferredSize] = useState<string[]>([]);
  const [maxAnimals, setMaxAnimals] = useState(1);
  const [references, setReferences] = useState('');
  const [hasCriminalHistory, setCriminalHistory] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleSpecies = (species: string) => {
    if (preferredSpecies.includes(species)) {
      setPreferredSpecies(preferredSpecies.filter(s => s !== species));
    } else {
      setPreferredSpecies([...preferredSpecies, species]);
    }
  };

  const toggleSize = (size: string) => {
    if (preferredSize.includes(size)) {
      setPreferredSize(preferredSize.filter(s => s !== size));
    } else {
      setPreferredSize([...preferredSize, size]);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!homeType || hasYard === null || hasOtherPets === null || !petExperience.trim() || preferredSpecies.length === 0) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'You must be logged in');
        return;
      }

      const { data, error } = await supabase
        .from('foster_applications')
        .insert([{
          user_id: user.id,
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

      Alert.alert(
        'Success!',
        'Your foster application has been submitted. We\'ll review it and contact you soon!',
        [{ text: 'OK', onPress: () => router.push('/(tabs)') }]
      );

    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Foster Application</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        {/* Home Type */}
        <Text style={styles.sectionTitle}>Home Type *</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.optionButton, homeType === 'house' && styles.selectedButton]}
            onPress={() => setHomeType('house')}
          >
            <Text style={[styles.buttonText, homeType === 'house' && styles.selectedText]}>House</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, homeType === 'apartment' && styles.selectedButton]}
            onPress={() => setHomeType('apartment')}
          >
            <Text style={[styles.buttonText, homeType === 'apartment' && styles.selectedText]}>Apartment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, homeType === 'condo' && styles.selectedButton]}
            onPress={() => setHomeType('condo')}
          >
            <Text style={[styles.buttonText, homeType === 'condo' && styles.selectedText]}>Condo</Text>
          </TouchableOpacity>
        </View>

        {/* Has Yard */}
        <Text style={styles.sectionTitle}>Do you have a yard? *</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.optionButton, hasYard === true && styles.selectedButton]}
            onPress={() => setHasYard(true)}
          >
            <Text style={[styles.buttonText, hasYard === true && styles.selectedText]}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, hasYard === false && styles.selectedButton]}
            onPress={() => setHasYard(false)}
          >
            <Text style={[styles.buttonText, hasYard === false && styles.selectedText]}>No</Text>
          </TouchableOpacity>
        </View>

        {/* Has Other Pets */}
        <Text style={styles.sectionTitle}>Do you have other pets? *</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.optionButton, hasOtherPets === true && styles.selectedButton]}
            onPress={() => setHasOtherPets(true)}
          >
            <Text style={[styles.buttonText, hasOtherPets === true && styles.selectedText]}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, hasOtherPets === false && styles.selectedButton]}
            onPress={() => setHasOtherPets(false)}
          >
            <Text style={[styles.buttonText, hasOtherPets === false && styles.selectedText]}>No</Text>
          </TouchableOpacity>
        </View>

        {/* Pet Experience */}
        <Text style={styles.sectionTitle}>Pet Experience *</Text>
        <TextInput
          style={styles.textArea}
          value={petExperience}
          onChangeText={setPetExperience}
          placeholder="Tell us about your experience with pets..."
          multiline
          numberOfLines={4}
        />

        {/*Criminal Background*/}
        <Text style={styles.sectionTitle}>Have you ever been accused of, arrested, or convicted of animal cruelty and/or family violence  *</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.optionButton, hasCriminalHistory === true && styles.selectedButton]}
            onPress={() => setCriminalHistory(true)}
          >
            <Text style={[styles.buttonText, hasCriminalHistory === true && styles.selectedText]}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, hasCriminalHistory === false && styles.selectedButton]}
            onPress={() => setCriminalHistory(false)}
          >
            <Text style={[styles.buttonText, hasCriminalHistory === false && styles.selectedText]}>Yes</Text>
          </TouchableOpacity>
        </View>

        {/* Preferred Species */}
        <Text style={styles.sectionTitle}>Preferred Species *</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.optionButton, preferredSpecies.includes('dog') && styles.selectedButton]}
            onPress={() => toggleSpecies('dog')}
          >
            <Text style={[styles.buttonText, preferredSpecies.includes('dog') && styles.selectedText]}>Dog</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, preferredSpecies.includes('cat') && styles.selectedButton]}
            onPress={() => toggleSpecies('cat')}
          >
            <Text style={[styles.buttonText, preferredSpecies.includes('cat') && styles.selectedText]}>Cat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, preferredSpecies.includes('either') && styles.selectedButton]}
            onPress={() => toggleSpecies('either')}
          >
            <Text style={[styles.buttonText, preferredSpecies.includes('either') && styles.selectedText]}>Either</Text>
          </TouchableOpacity>
        </View>

        {/* Preferred Size */}
        <Text style={styles.sectionTitle}>Preferred Size</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.optionButton, preferredSize.includes('small') && styles.selectedButton]}
            onPress={() => toggleSize('small')}
          >
            <Text style={[styles.buttonText, preferredSize.includes('small') && styles.selectedText]}>Small</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, preferredSize.includes('medium') && styles.selectedButton]}
            onPress={() => toggleSize('medium')}
          >
            <Text style={[styles.buttonText, preferredSize.includes('medium') && styles.selectedText]}>Medium</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, preferredSize.includes('large') && styles.selectedButton]}
            onPress={() => toggleSize('large')}
          >
            <Text style={[styles.buttonText, preferredSize.includes('large') && styles.selectedText]}>Large</Text>
          </TouchableOpacity>
        </View>

        {/* Max Animals */}
        <Text style={styles.sectionTitle}>Max animals you can foster</Text>
        <View style={styles.buttonGroup}>
          {[1, 2, 3, 4, 5].map(num => (
            <TouchableOpacity
              key={num}
              style={[styles.optionButton, styles.smallButton, maxAnimals === num && styles.selectedButton]}
              onPress={() => setMaxAnimals(num)}
            >
              <Text style={[styles.buttonText, maxAnimals === num && styles.selectedText]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* References */}
        <Text style={styles.sectionTitle}>References</Text>
        <TextInput
          style={styles.textArea}
          value={references}
          onChangeText={setReferences}
          placeholder="Provide 2-3 references (name, phone, relationship)..."
          multiline
          numberOfLines={4}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    fontSize: 16,
    color: '#1E90FF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1E90FF',
    backgroundColor: '#FFFFFF',
  },
  smallButton: {
    paddingHorizontal: 16,
  },
  selectedButton: {
    backgroundColor: '#1E90FF',
  },
  buttonText: {
    color: '#1E90FF',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  textArea: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#1E90FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});