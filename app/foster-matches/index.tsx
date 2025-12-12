import { BorderRadius, Colors, Shadows } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const blurhash = 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH';

interface FoundAnimal {
  id: string;
  species: string;
  size: string;
  color?: string;
  breed?: string;
  description: string;
  health_status: string;
  location_lat: number;
  location_lng: number;
  photos?: string[];
  created_at: string;
  urgency_level: string;
}

export default function FosterMatchesScreen() {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<FoundAnimal[]>([]);
  const [userApplication, setUserApplication] = useState<any>(null);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Error', 'You must be logged in');
        setLoading(false);
        return;
      }

      // Get user's foster application
      const { data: application } = await supabase
        .from('foster_applications')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setUserApplication(application);

      // Get available animals that match preferences
      let query = supabase
        .from('found_animals')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Filter by preferred species if application exists
      if (application?.preferred_species?.length > 0) {
        const species = application.preferred_species;
        if (!species.includes('either')) {
          query = query.in('species', species);
        }
      }

      const { data: animals, error } = await query;

      if (error) throw error;

      setMatches(animals || []);
    } catch (error: any) {
      console.error('Error loading matches:', error);
      Alert.alert('Error', 'Could not load matches');
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'high':
        return Colors.danger;
      case 'medium':
        return Colors.secondary;
      default:
        return Colors.success;
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return '✅';
      case 'injured':
        return '🤕';
      case 'sick':
        return '🤒';
      case 'needs_vet':
        return '🏥';
      default:
        return '❓';
    }
  };

  const handleContactAboutAnimal = (animal: FoundAnimal) => {
    Alert.alert(
      'Contact About This Animal',
      `Would you like to express interest in fostering this ${animal.species}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, I\'m Interested',
          onPress: () => {
            // In a real app, this would send a notification or create a match record
            Alert.alert(
              'Interest Submitted! 🎉',
              'We\'ll notify the finder and our team. They\'ll be in touch soon!',
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading matches...</Text>
      </View>
    );
  }

  if (!userApplication) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Foster Matches</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="heart-broken" size={80} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Application Found</Text>
          <Text style={styles.emptyText}>
            You need to submit a foster application before we can show you matches.
          </Text>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => router.push('/foster-application')}
          >
            <Text style={styles.applyButtonText}>Apply to Foster</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
          <Text style={styles.headerTitle}>Foster Matches</Text>
          <Text style={styles.headerSubtitle}>{matches.length} animals need you</Text>
        </View>
        <View style={{ width: 40 }} />
      </Animated.View>

      {matches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="paw-off" size={80} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Matches Yet</Text>
          <Text style={styles.emptyText}>
            We'll notify you when animals matching your preferences are found.
          </Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {matches.map((animal, index) => (
            <Animated.View
              key={animal.id}
              entering={FadeInDown.delay(200 + index * 50).springify()}
            >
              <View style={styles.matchCard}>
                {/* Urgency Badge */}
                {animal.urgency_level === 'high' && (
                  <View style={styles.urgencyBadge}>
                    <Ionicons name="alert-circle" size={16} color={Colors.card} />
                    <Text style={styles.urgencyText}>URGENT</Text>
                  </View>
                )}

                {/* Animal Photo */}
                {animal.photos && animal.photos.length > 0 ? (
                  <Image
                    source={{ uri: animal.photos[0] }}
                    style={styles.animalPhoto}
                    placeholder={blurhash}
                    contentFit="cover"
                    transition={200}
                  />
                ) : (
                  <View style={styles.placeholderPhoto}>
                    <MaterialCommunityIcons 
                      name={animal.species === 'dog' ? 'dog' : 'cat'} 
                      size={60} 
                      color={Colors.textSecondary} 
                    />
                  </View>
                )}

                {/* Animal Info */}
                <View style={styles.animalInfo}>
                  <View style={styles.animalHeader}>
                    <Text style={styles.animalSpecies}>
                      {animal.species === 'dog' ? '🐕' : animal.species === 'cat' ? '🐈' : '🐾'} {animal.species.charAt(0).toUpperCase() + animal.species.slice(1)}
                    </Text>
                    <View style={styles.sizeBadge}>
                      <Text style={styles.sizeText}>{animal.size}</Text>
                    </View>
                  </View>

                  {animal.breed && (
                    <Text style={styles.breedText}>{animal.breed}</Text>
                  )}

                  {animal.color && (
                    <Text style={styles.colorText}>Color: {animal.color}</Text>
                  )}

                  <View style={styles.healthContainer}>
                    <Text style={styles.healthText}>
                      {getHealthIcon(animal.health_status)} {animal.health_status.replace('_', ' ')}
                    </Text>
                  </View>

                  <Text style={styles.description} numberOfLines={3}>
                    {animal.description}
                  </Text>

                  <View style={styles.locationContainer}>
                    <Ionicons name="location" size={16} color={Colors.textSecondary} />
                    <Text style={styles.locationText}>
                      {animal.location_lat.toFixed(4)}, {animal.location_lng.toFixed(4)}
                    </Text>
                  </View>

                  <Text style={styles.dateText}>
                    Found {new Date(animal.created_at).toLocaleDateString()}
                  </Text>

                  {/* Action Button */}
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => handleContactAboutAnimal(animal)}
                  >
                    <MaterialCommunityIcons name="heart" size={20} color={Colors.card} />
                    <Text style={styles.contactButtonText}>I'm Interested</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
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
    padding: 20,
  },
  matchCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    marginBottom: 20,
    overflow: 'hidden',
    ...Shadows.md,
  },
  urgencyBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.danger,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    zIndex: 10,
    ...Shadows.md,
  },
  urgencyText: {
    color: Colors.card,
    fontSize: 12,
    fontWeight: 'bold',
  },
  animalPhoto: {
    width: '100%',
    height: 240,
  },
  placeholderPhoto: {
    width: '100%',
    height: 240,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animalInfo: {
    padding: 20,
  },
  animalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  animalSpecies: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  sizeBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  sizeText: {
    color: Colors.card,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  breedText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  colorText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  healthContainer: {
    marginBottom: 12,
  },
  healthText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  dateText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  contactButtonText: {
    color: Colors.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 20,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.full,
    ...Shadows.md,
  },
  applyButtonText: {
    color: Colors.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
});