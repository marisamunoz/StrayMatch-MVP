import { BorderRadius, Colors, Shadows } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const blurhash = 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH';

export default function HomeScreen() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          style={styles.header}
        >
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <Image
                source={require('../assets/images/pawlogo.png')}
                style={styles.avatar}
                placeholder={blurhash}
                contentFit="cover"
                transition={200}
              />
            </View>
            <View>
              <Text style={styles.greeting}>Welcome back! 👋</Text>
              <Text style={styles.userName}>Stray Helper</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        </Animated.View>

        {/* Hero Card - Report Stray */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          style={styles.heroCardContainer}
        >
          <LinearGradient
            colors={['#3B82F6', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroTitle}>Found a Stray?</Text>
                <Text style={styles.heroSubtitle}>
                  Report it now and help them find a loving home
                </Text>
                <TouchableOpacity 
                  style={styles.heroButton}
                  onPress={() => router.push('/report-animal')}
                >
                  <Text style={styles.heroButtonText}>Report Stray</Text>
                  <Ionicons name="arrow-forward" size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.heroImageContainer}>
                <Image
                  source={require('../assets/images/DogCat.png')}
                  style={styles.heroImage}
                  placeholder={blurhash}
                  contentFit="contain"
                  transition={200}
                />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Actions Title */}
        <Animated.View 
          entering={FadeInUp.delay(300).springify()}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Text style={styles.sectionSubtitle}>What would you like to do?</Text>
        </Animated.View>

        {/* Grid Menu */}
        <Animated.View 
          entering={FadeInUp.delay(400).springify()}
          style={styles.gridContainer}
        >
          {/* Foster Card */}
          <TouchableOpacity
            style={[styles.menuCard, styles.menuCardLarge]}
            onPress={() => router.push('/foster-application')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#EEF2FF' }]}>
              <MaterialCommunityIcons name="home-heart" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.menuCardTitle}>Foster</Text>
            <Text style={styles.menuCardSubtitle}>Become a foster parent</Text>
          </TouchableOpacity>

          {/* Emergency Card */}
          <TouchableOpacity
            style={[styles.menuCard, styles.menuCardLarge]}
            onPress={() => router.push('/emergency')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="medical" size={32} color={Colors.danger} />
            </View>
            <Text style={styles.menuCardTitle}>Emergency</Text>
            <Text style={styles.menuCardSubtitle}>Urgent rescue help</Text>
          </TouchableOpacity>

          {/* Chat AI Card */}
          <TouchableOpacity
            style={[styles.menuCard, styles.menuCardSmall]}
            onPress={() => router.push('/chat')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="chatbubble-ellipses" size={28} color="#10B981" />
            </View>
            <Text style={styles.menuCardTitle}>Chat AI</Text>
            <Text style={styles.menuCardSubtitle}>Get instant help</Text>
          </TouchableOpacity>

          {/* Matches Card */}
          <TouchableOpacity
            style={[styles.menuCard, styles.menuCardSmall]}
            onPress={() => router.push('/foster-matches')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
              <MaterialCommunityIcons name="heart-multiple" size={28} color={Colors.secondary} />
            </View>
            <Text style={styles.menuCardTitle}>Matches</Text>
            <Text style={styles.menuCardSubtitle}>View your matches</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    ...Shadows.md,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  greeting: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: 'bold',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  heroCardContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  heroCard: {
    borderRadius: BorderRadius.xxl,
    padding: 24,
    ...Shadows.lg,
    overflow: 'hidden',
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.card,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    lineHeight: 20,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    gap: 8,
  },
  heroButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  heroImageContainer: {
    width: 120,
    height: 120,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  gridContainer: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  menuCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: 20,
    ...Shadows.md,
  },
  menuCardLarge: {
    width: '47%',
    minHeight: 160,
  },
  menuCardSmall: {
    width: '47%',
    minHeight: 140,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  menuCardSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 20,
  },
});
