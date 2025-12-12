import { BorderRadius, Colors, Shadows } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

export default function EmergencyScreen() {
  const [tipsExpanded, setTipsExpanded] = useState(false);
  const tipsHeight = useSharedValue(0);

  const callNumber = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const toggleTips = () => {
    setTipsExpanded(!tipsExpanded);
    tipsHeight.value = withTiming(tipsExpanded ? 0 : 1, { duration: 300 });
  };

  const tipsStyle = useAnimatedStyle(() => ({
    height: tipsHeight.value * 280, // Approximate height of tips content
    opacity: tipsHeight.value,
    overflow: 'hidden',
  }));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Emergency Resources</Text>
          <Text style={styles.headerSubtitle}>Quick help when you need it</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Warning Banner */}
        <View style={styles.warningBanner}>
          <Ionicons name="warning" size={24} color="#92400E" />
          <Text style={styles.warningText}>
            For life-threatening emergencies, call 911 immediately
          </Text>
        </View>

        {/* Quick Dial Grid */}
        <Text style={styles.sectionTitle}>Quick Dial</Text>
        
        <View style={styles.quickDialGrid}>
          {/* Animal Control - Red */}
          <TouchableOpacity
            style={[styles.quickDialButton, styles.quickDialRed]}
            onPress={() => callNumber('210-207-4738')}
            activeOpacity={0.8}
          >
            <View style={styles.quickDialIcon}>
              <Ionicons name="shield-checkmark" size={40} color={Colors.card} />
            </View>
            <Text style={styles.quickDialTitle}>Animal Control</Text>
            <Text style={styles.quickDialSubtitle}>24/7 Emergency Response</Text>
            <View style={styles.quickDialPhone}>
              <Ionicons name="call" size={18} color={Colors.card} />
              <Text style={styles.quickDialPhoneText}>(210) 207-4738</Text>
            </View>
          </TouchableOpacity>

          {/* Emergency Vet - Green */}
          <TouchableOpacity
            style={[styles.quickDialButton, styles.quickDialGreen]}
            onPress={() => callNumber('210-822-2873')}
            activeOpacity={0.8}
          >
            <View style={styles.quickDialIcon}>
              <Ionicons name="medical" size={40} color={Colors.card} />
            </View>
            <Text style={styles.quickDialTitle}>Emergency Vet</Text>
            <Text style={styles.quickDialSubtitle}>VCA Becker Hospital</Text>
            <View style={styles.quickDialPhone}>
              <Ionicons name="call" size={18} color={Colors.card} />
              <Text style={styles.quickDialPhoneText}>(210) 822-2873</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Collapsible Safety Tips */}
        <TouchableOpacity
          style={styles.tipsHeader}
          onPress={toggleTips}
          activeOpacity={0.7}
        >
          <View style={styles.tipsHeaderLeft}>
            <Ionicons name="information-circle" size={24} color={Colors.primary} />
            <Text style={styles.tipsHeaderText}>Safety Tips</Text>
          </View>
          <Ionicons
            name={tipsExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>

        <Animated.View style={tipsStyle}>
          <View style={styles.tipsContent}>
            <TipItem icon="close-circle" text="Do not approach aggressive animals" />
            <TipItem icon="hand-left" text="Keep a safe distance from injured animals" />
            <TipItem icon="medical" text="Never attempt to treat injuries yourself" />
            <TipItem icon="warning" text="Call professionals for rabies concerns" />
            <TipItem icon="camera" text="Document location and condition with photos" />
          </View>
        </Animated.View>

        {/* Additional Resources */}
        <Text style={styles.sectionTitle}>Additional Resources</Text>

        <TouchableOpacity
          style={styles.resourceCard}
          onPress={() => callNumber('210-207-4738')}
        >
          <View style={styles.resourceIcon}>
            <Ionicons name="home" size={28} color={Colors.primary} />
          </View>
          <View style={styles.resourceInfo}>
            <Text style={styles.resourceTitle}>Animal Care Services (ACS)</Text>
            <Text style={styles.resourceSubtitle}>Main Shelter</Text>
            <Text style={styles.resourceAddress}>4710 TX-151, San Antonio, TX 78227</Text>
          </View>
          <Ionicons name="call" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

interface TipItemProps {
  icon: string;
  text: string;
}

function TipItem({ icon, text }: TipItemProps) {
  return (
    <View style={styles.tipItem}>
      <Ionicons name={icon as any} size={20} color={Colors.primary} />
      <Text style={styles.tipText}>{text}</Text>
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
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: BorderRadius.md,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    fontWeight: '600',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  quickDialGrid: {
    gap: 16,
    marginBottom: 32,
  },
  quickDialButton: {
    padding: 24,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.lg,
  },
  quickDialRed: {
    backgroundColor: Colors.danger,
  },
  quickDialGreen: {
    backgroundColor: Colors.success,
  },
  quickDialIcon: {
    marginBottom: 12,
  },
  quickDialTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.card,
    marginBottom: 4,
  },
  quickDialSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  quickDialPhone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
  },
  quickDialPhoneText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.card,
    letterSpacing: 0.5,
  },
  tipsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 18,
    borderRadius: BorderRadius.md,
    marginBottom: 8,
    ...Shadows.sm,
  },
  tipsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipsHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  tipsContent: {
    backgroundColor: '#EFF6FF',
    padding: 20,
    borderRadius: BorderRadius.md,
    gap: 14,
    marginBottom: 24,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 18,
    borderRadius: BorderRadius.md,
    marginBottom: 12,
    ...Shadows.md,
  },
  resourceIcon: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  resourceSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  resourceAddress: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});