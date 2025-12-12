import { LoadingAnimation } from '@/components/ui/LoadingAnimation';
import { SelectableChip } from '@/components/ui/SelectableChip';
import { BorderRadius, Colors, Shadows } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image as ExpoImage } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const blurhash = 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH';

export default function ReportAnimalScreen() {
  const params = useLocalSearchParams();
  
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  
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


  // Auto-request location on mount and show loading animation
  useEffect(() => {
    // Show cute animation for 2.5 seconds
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2500);

    requestAndGetLocation();

    return () => clearTimeout(timer);
  }, []);

  const requestAndGetLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.log('Location error:', error);
    } finally {
      setLocationLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to report animals');
        setLocationLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert('Error', 'Could not get location');
    } finally {
      setLocationLoading(false);
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
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const removePhoto = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validation
    if (!species) {
      Alert.alert('Required Field', 'Please select a species');
      return;
    }
    if (!size) {
      Alert.alert('Required Field', 'Please select a size');
      return;
    }
    if (!healthStatus) {
      Alert.alert('Required Field', 'Please select health status');
      return;
    }
    if (!location) {
      Alert.alert('Required Field', 'Please capture location');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Required Field', 'Please add a description');
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
      const { error } = await supabase
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
            photos: photos,
            status: 'active',
            urgency_level: healthStatus === 'needs_vet' || healthStatus === 'injured' ? 'high' : 'medium',
          },
        ])
        .select();

      setLoading(false);

      if (error) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Error', error.message);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Success! 🎉',
          'Animal reported successfully. We\'ll start matching with foster families.',
          [{ text: 'OK', onPress: () => router.push('/') }]
        );
      }
    } catch (error: any) {
      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', error.message);
    }
  };

  // Show cute loading animation on initial load
  if (initialLoading) {
    return <LoadingAnimation message="Preparing to help a stray..." showFunFact={true} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View 
        entering={FadeInDown.delay(100).springify()}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Report Found Animal</Text>
          <Text style={styles.headerSubtitle}>Help us find them a home</Text>
        </View>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Species Selection */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          style={styles.section}
        >
          <Text style={styles.label}>Species *</Text>
          <View style={styles.chipGroup}>
            <SelectableChip
              label="🐕 Dog"
              selected={species === 'dog'}
              onPress={() => setSpecies('dog')}
            />
            <SelectableChip
              label="🐈 Cat"
              selected={species === 'cat'}
              onPress={() => setSpecies('cat')}
            />
            <SelectableChip
              label="Other"
              selected={species === 'other'}
              onPress={() => setSpecies('other')}
            />
          </View>
        </Animated.View>

        {/* Size Selection */}
        <Animated.View 
          entering={FadeInDown.delay(250).springify()}
          style={styles.section}
        >
          <Text style={styles.label}>Size *</Text>
          <View style={styles.chipGroup}>
            <SelectableChip
              label="Small"
              selected={size === 'small'}
              onPress={() => setSize('small')}
            />
            <SelectableChip
              label="Medium"
              selected={size === 'medium'}
              onPress={() => setSize('medium')}
            />
            <SelectableChip
              label="Large"
              selected={size === 'large'}
              onPress={() => setSize('large')}
            />
            <SelectableChip
              label="Extra Large"
              selected={size === 'extra_large'}
              onPress={() => setSize('extra_large')}
            />
          </View>
        </Animated.View>

        {/* Health Status */}
        <Animated.View 
          entering={FadeInDown.delay(300).springify()}
          style={styles.section}
        >
          <Text style={styles.label}>Health Status *</Text>
          <View style={styles.chipGroup}>
            <SelectableChip
              label="✅ Healthy"
              selected={healthStatus === 'healthy'}
              onPress={() => setHealthStatus('healthy')}
            />
            <SelectableChip
              label="🤕 Injured"
              selected={healthStatus === 'injured'}
              onPress={() => setHealthStatus('injured')}
            />
            <SelectableChip
              label="🤒 Sick"
              selected={healthStatus === 'sick'}
              onPress={() => setHealthStatus('sick')}
            />
            <SelectableChip
              label="🏥 Needs Vet"
              selected={healthStatus === 'needs_vet'}
              onPress={() => setHealthStatus('needs_vet')}
            />
          </View>
        </Animated.View>

        {/* Color & Breed */}
        <Animated.View 
          entering={FadeInDown.delay(350).springify()}
          style={styles.section}
        >
          <Text style={styles.label}>Color (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Brown and white"
            placeholderTextColor={Colors.textSecondary}
            value={color}
            onChangeText={setColor}
          />
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400).springify()}
          style={styles.section}
        >
          <Text style={styles.label}>Breed (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Labrador mix"
            placeholderTextColor={Colors.textSecondary}
            value={breed}
            onChangeText={setBreed}
          />
        </Animated.View>

        {/* Description */}
        <Animated.View 
          entering={FadeInDown.delay(450).springify()}
          style={styles.section}
        >
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe the animal's appearance, behavior, and where you found them..."
            placeholderTextColor={Colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </Animated.View>

        {/* Photos */}
        <Animated.View 
          entering={FadeInDown.delay(500).springify()}
          style={styles.section}
        >
          <Text style={styles.label}>Photos</Text>
          <View style={styles.photoButtonsContainer}>
            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color={Colors.primary} />
              <Text style={styles.photoButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
              <Ionicons name="images" size={24} color={Colors.primary} />
              <Text style={styles.photoButtonText}>Gallery</Text>
            </TouchableOpacity>
          </View>
          
          {photos.length > 0 && (
            <View style={styles.photoGrid}>
              {photos.map((uri, index) => (
                <View key={index} style={styles.photoContainer}>
                  <ExpoImage
                    source={{ uri }}
                    style={styles.photo}
                    placeholder={blurhash}
                    contentFit="cover"
                    transition={200}
                  />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Ionicons name="close-circle" size={28} color={Colors.danger} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </Animated.View>

        {/* Location */}
        <Animated.View 
          entering={FadeInDown.delay(550).springify()}
          style={styles.section}
        >
          <Text style={styles.label}>Location *</Text>
          <TouchableOpacity 
            style={[
              styles.locationButton,
              location && styles.locationButtonActive
            ]} 
            onPress={getCurrentLocation}
            disabled={locationLoading}
          >
            {locationLoading ? (
              <ActivityIndicator color={Colors.card} />
            ) : (
              <>
                <Ionicons 
                  name={location ? "checkmark-circle" : "location"} 
                  size={24} 
                  color={Colors.card} 
                />
                <Text style={styles.locationButtonText}>
                  {location ? '✓ Location Captured' : 'Capture Current Location'}
                </Text>
              </>
            )}
          </TouchableOpacity>
          {location && (
            <View style={styles.locationInfo}>
              <Ionicons name="pin" size={16} color={Colors.textSecondary} />
              <Text style={styles.locationText}>
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Submit Button */}
        <Animated.View 
          entering={FadeInDown.delay(600).springify()}
          style={styles.submitContainer}
        >
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.card} />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Submit Report</Text>
                <Ionicons name="checkmark-circle" size={24} color={Colors.card} />
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingBottom: 20,
    backgroundColor: Colors.card,
    ...Shadows.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  section: {
    marginBottom: 28,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
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
  photoButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.card,
  },
  photoButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoContainer: {
    position: 'relative',
    width: 110,
    height: 110,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.lg,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.card,
    borderRadius: 14,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    ...Shadows.md,
  },
  locationButtonActive: {
    backgroundColor: Colors.success,
  },
  locationButtonText: {
    color: Colors.card,
    fontWeight: '600',
    fontSize: 16,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 4,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  submitContainer: {
    marginTop: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 18,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success,
    ...Shadows.lg,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.textSecondary,
  },
  submitButtonText: {
    color: Colors.card,
    fontSize: 18,
    fontWeight: 'bold',
  },
});