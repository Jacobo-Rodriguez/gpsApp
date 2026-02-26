import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

export default function AddMessageButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.fab} onPress={onPress}>
      <Ionicons name="add" size={32} color="white" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1ec9a4',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});
