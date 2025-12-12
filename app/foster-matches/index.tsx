import { router } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MatchesScreen() {
  const callNumber = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Resources</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Safety Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Safety Tips</Text>
          <Text style={styles.tipText}>• Do not approach aggressive animals</Text>
          <Text style={styles.tipText}>• Keep a safe distance from injured animals</Text>
          <Text style={styles.tipText}>• Never attempt to treat injuries yourself</Text>
          <Text style={styles.tipText}>• Call professionals for rabies concerns</Text>
          <Text style={styles.tipText}>• Document location and condition with photos</Text>
        </View>
        
        <Text style={styles.warningText}>⚠️ For life-threatening emergencies, call 911 immediately</Text>

        {/* Animal Control */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}> San Antonio Animal Control</Text>
          <Text style={styles.description}>24/7 Emergency Response</Text>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => callNumber('210-207-4738')}
          >
            <Text style={styles.callButtonText}> Call (210) 207-4738</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Vet */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}> Emergency Veterinary Clinic</Text>
          <Text style={styles.description}>VCA Becker Animal Hospital</Text>
          <Text style={styles.address}>8700 Crownhill Blvd, San Antonio, TX 78209</Text>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => callNumber('210-822-2873')}
          >
            <Text style={styles.callButtonText}> Call (210) 822-2873</Text>
          </TouchableOpacity>
        </View>

        {/* ACS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}> Animal Care Services (ACS)</Text>
          <Text style={styles.description}>Main Shelter</Text>
          <Text style={styles.address}>4710 TX-151, San Antonio, TX 78227</Text>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => callNumber('210-207-4738')}
          >
            <Text style={styles.callButtonText}> Call (210) 207-4738</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  warningText: {
    backgroundColor: '#FFF3CD',
    color: '#856404',
    padding: 16,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  callButton: {
    backgroundColor: '#1E90FF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsSection: {
    backgroundColor: '#E6F3FF',
    padding: 20,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 40,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
});