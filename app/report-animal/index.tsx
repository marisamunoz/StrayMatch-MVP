import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ReportAnimalScreen() {
  const params = useLocalSearchParams();
  
  const [loading, setLoading] = useState(false);
  
  // Pre-fill from chat if available
  const [species, setSpecies] = useState<'dog' | 'cat' | 'other' | null>(
    (params.species as 'dog' | 'cat' | 'other') || null
  );
  const [size, setSize] = useState<'small' | 'medium' | 'large' | 'extra_large' | null>(
    (params.size as 'small' | 'medium' | 'large' | 'extra_large') || null
  );
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'injured' | 'sick' | 'needs_vet' | null>(
    (params.health_status as 'healthy' | 'injured' | 'sick' | 'needs_vet') || null
  );
  const [description, setDescription] = useState(
    typeof params.description === 'string' ? params.description : ''
  );
  const [color, setColor] = useState(
    typeof params.color === 'string' ? params.color : ''
  );
  const [breed, setBreed] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);



  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to report animals');
      return false;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    try {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      Alert.alert('Success', 'Location captured!');
    } catch (error) {
      Alert.alert('Error', 'Could not get location');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera roll permission is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };


  const handleSubmit = async () => {
    // Validation
    if (!species) {
      Alert.alert('Error', 'Please select a species');
      return;
    }
    if (!size) {
      Alert.alert('Error', 'Please select a size');
      return;
    }
    if (!healthStatus) {
      Alert.alert('Error', 'Please select health status');
      return;
    }
    if (!location) {
      Alert.alert('Error', 'Please capture location');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please add a description');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Error', 'You must be logged in');
        setLoading(false);
        return;
      }

      // Insert into database
      const { data, error } = await supabase
        .from('found_animals')
        .insert([
          {
            finder_id: user.id,
            species,
            size,
            color,
            breed,
            description,
            location_lat: location.latitude,
            location_lng: location.longitude,
            health_status: healthStatus,
            photos: photos, // For now, storing URIs then later we can upload to storage
            status: 'active',
            urgency_level: healthStatus === 'needs_vet' || healthStatus === 'injured' ? 'high' : 'medium',
          },
        ])
        .select();

      setLoading(false);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert(
          'Success!',
          'Animal reported successfully. We\'ll start matching with foster families.',
          [{ text: 'OK', onPress: () => router.push('/(tabs)') }]
        );
      }
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('/(tabs)')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Report Found Animal</Text>
      </View>

      {/* Species Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Species *</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.optionButton, species === 'dog' && styles.selectedButton]}
            onPress={() => setSpecies('dog')}
          >
            <Text style={[styles.optionText, species === 'dog' && styles.selectedText]}>Dog</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, species === 'cat' && styles.selectedButton]}
            onPress={() => setSpecies('cat')}
          >
            <Text style={[styles.optionText, species === 'cat' && styles.selectedText]}>Cat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, species === 'other' && styles.selectedButton]}
            onPress={() => setSpecies('other')}
          >
            <Text style={[styles.optionText, species === 'other' && styles.selectedText]}>Other</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Size Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Size *</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.optionButton, size === 'small' && styles.selectedButton]}
            onPress={() => setSize('small')}
          >
            <Text style={[styles.optionText, size === 'small' && styles.selectedText]}>Small</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, size === 'medium' && styles.selectedButton]}
            onPress={() => setSize('medium')}
          >
            <Text style={[styles.optionText, size === 'medium' && styles.selectedText]}>Medium</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, size === 'large' && styles.selectedButton]}
            onPress={() => setSize('large')}
          >
            <Text style={[styles.optionText, size === 'large' && styles.selectedText]}>Large</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Health Status */}
      <View style={styles.section}>
        <Text style={styles.label}>Health Status *</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.optionButton, healthStatus === 'healthy' && styles.selectedButton]}
            onPress={() => setHealthStatus('healthy')}
          >
            <Text style={[styles.optionText, healthStatus === 'healthy' && styles.selectedText]}>Healthy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, healthStatus === 'injured' && styles.selectedButton]}
            onPress={() => setHealthStatus('injured')}
          >
            <Text style={[styles.optionText, healthStatus === 'injured' && styles.selectedText]}>Injured</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, healthStatus === 'sick' && styles.selectedButton]}
            onPress={() => setHealthStatus('sick')}
          >
            <Text style={[styles.optionText, healthStatus === 'sick' && styles.selectedText]}>Sick</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, healthStatus === 'needs_vet' && styles.selectedButton]}
            onPress={() => setHealthStatus('needs_vet')}
          >
            <Text style={[styles.optionText, healthStatus === 'needs_vet' && styles.selectedText]}>Needs Vet</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Color & Breed */}
      <View style={styles.section}>
        <Text style={styles.label}>Color (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Brown and white"
          value={color}
          onChangeText={setColor}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Breed (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Labrador mix"
          value={breed}
          onChangeText={setBreed}
        />
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the animal's appearance, behavior, and where you found them..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Photos */}
      <View style={styles.section}>
        <Text style={styles.label}>Photos</Text>
        <View style={styles.photoButtons}>
          <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
            <Text style={styles.photoButtonText}> Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            <Text style={styles.photoButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.photoGrid}>
          {photos.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.photo} />
          ))}
        </View>
      </View>

      {/* Location */}
      <View style={styles.section}>
        <Text style={styles.label}>Location *</Text>
        <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
          <Text style={styles.locationButtonText}>
            {location ? ' Location Captured' : 'Capture Current Location'}
          </Text>
        </TouchableOpacity>
        {location && (
          <Text style={styles.locationText}>
            Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
          </Text>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Report</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: '#1E90FF',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#1E90FF',
    backgroundColor: '#fff',
  },
  selectedButton: {
    backgroundColor: '#1E90FF',
  },
  optionText: {
    color: '#1E90FF',
    fontWeight: '600',
  },
  selectedText: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  photoButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E90FF',
    alignItems: 'center',
  },
  photoButtonText: {
    color: '#1E90FF',
    fontWeight: '600',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  locationButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#1E90FF',
    alignItems: 'center',
  },
  locationButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  locationText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 50,
    backgroundColor: '#1E90FF',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});