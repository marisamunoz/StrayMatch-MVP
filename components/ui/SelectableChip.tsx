import { BorderRadius, Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface SelectableChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export function SelectableChip({ label, selected, onPress, style }: SelectableChipProps) {
  const handlePress = () => {
    Haptics.selectionAsync();
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected ? styles.chipSelected : styles.chipUnselected,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    minWidth: 80,
    alignItems: 'center',
  },
  chipUnselected: {
    backgroundColor: Colors.card,
    borderColor: Colors.primary,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
  chipTextSelected: {
    color: Colors.card,
  },
});
