import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0); // Start hidden
  
  // Positions for the 4 bubbles
  const bubble1 = useSharedValue({ x: 0, y: 0 });
  const bubble2 = useSharedValue({ x: 0, y: 0 });
  const bubble3 = useSharedValue({ x: 0, y: 0 });
  const bubble4 = useSharedValue({ x: 0, y: 0 });

  const handleAnimalTap = () => {
    if (!menuExpanded) {
      // Burst out animation
      scale.value = withSequence(
        withSpring(1.2),
        withSpring(1)
      );
      
      // Fade in bubbles
      opacity.value = withTiming(1, { duration: 300 });
      
      // Position bubbles in a circle around the center (170px radius)
      bubble1.value = withSpring({ x: 0, y: -110 }); // Top - Chat Assistant
      bubble2.value = withSpring({ x: 110, y: 0 });  // Right - Find Foster
      bubble3.value = withSpring({ x: 0, y: 110 });  // Bottom - Report Pet
      bubble4.value = withSpring({ x: -110, y: 0 }); // Left - Emergency
      
      setMenuExpanded(true);
    } else {
      // Fade out bubbles
      opacity.value = withTiming(0, { duration: 200 });
      
      // Collapse back
      bubble1.value = withSpring({ x: 0, y: 0 });
      bubble2.value = withSpring({ x: 0, y: 0 });
      bubble3.value = withSpring({ x: 0, y: 0 });
      bubble4.value = withSpring({ x: 0, y: 0 });
      
      setMenuExpanded(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/auth/login');
  };

  // Animated styles
  const animalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bubbleOpacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const bubble1Style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: bubble1.value.x },
      { translateY: bubble1.value.y },
    ],
  }));

  const bubble2Style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: bubble2.value.x },
      { translateY: bubble2.value.y },
    ],
  }));

  const bubble3Style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: bubble3.value.x },
      { translateY: bubble3.value.y },
    ],
  }));

  const bubble4Style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: bubble4.value.x },
      { translateY: bubble4.value.y },
    ],
  }));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../../assets/images/pawlogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>
          Helping Stray{'\n'}Pets Find{'\n'}
          <Text style={styles.heroTitleOrange}>Loving Homes</Text>
        </Text>
      </View>

      {/* Interactive Animal Center */}
      <View style={styles.centerContainer}>
        <TouchableOpacity onPress={handleAnimalTap} activeOpacity={0.9}>
          <Animated.View style={[styles.animalContainer, animalStyle]}>
            <Image 
              source={require('../../assets/images/DogCat.png')}
              style={styles.animalImage}
              resizeMode="contain"
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Bubble 1: Chat Assistant (Top) */}
        <Animated.View style={[styles.bubble, bubble1Style]} pointerEvents={menuExpanded ? 'auto' : 'none'}>
          <TouchableOpacity 
            style={styles.bubbleButton}
            onPress={() => router.push('/chat')}
          >
            <Image 
              source={require('../../assets/images/ChatAssistant.png')}
              style={styles.bubbleIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Bubble 2: Find Foster Families (Right) */}
        <Animated.View style={[styles.bubble, bubble3Style]} pointerEvents={menuExpanded ? 'auto' : 'none'}>    
          <TouchableOpacity 
            style={styles.bubbleButton}
            onPress={() => router.push('/foster-application')}
          >
            <Image 
              source={require('../../assets/images/FindFosterFamilies.png')}
              style={styles.bubbleIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Bubble 3: Report a Pet (Bottom) */}
        <Animated.View style={[styles.bubble, bubble2Style]} pointerEvents={menuExpanded ? 'auto' : 'none'}> 
          <TouchableOpacity 
            style={styles.bubbleButton}
            onPress={() => router.push('/report-animal')}
          >
            <Image 
              source={require('../../assets/images/ReportAPet.png')}
              style={styles.bubbleIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Bubble 4: Emergency Rescue (Left) */}
        <Animated.View style={[styles.bubble, bubble4Style]} pointerEvents={menuExpanded ? 'auto' : 'none'}>
          <TouchableOpacity 
            style={styles.bubbleButton}
            onPress={() => router.push('/emergency')}
          >
            <Image 
              source={require('../../assets/images/EmergencyPetRescue.png')}
              style={styles.bubbleIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
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
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 28,
    color: '#1E90FF',
  },
  heroSection: {
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    lineHeight: 40,
  },
  heroTitleOrange: {
    color: '#1E90FF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  animalContainer: {
    width: 350,
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animalImage: {
    width: '100%',
    height: '100%',
  },
  bubble: {
    position: 'absolute',
    zIndex: 10,
  },
  bubbleButton: {
    width: 85,
    height: 85,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  bubbleIcon: {
    width: 260,
    height: 260,
  },
  logoutButton: {
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 50,
    alignItems: 'center',
  },
  logoutText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
});