import { Pressable, Text, View } from 'react-native';
import { MapMessage } from '../types/MapMessage';

export default function MessageCard({
  message,
  onClose,
}: {
  message: MapMessage;
  onClose: () => void;
}) {
  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      width: '100%',
      padding: 20,
      backgroundColor: 'white',
    }}>
      <Text>{message.text}</Text>
      <Pressable onPress={onClose}>
        <Text>Close</Text>
      </Pressable>
    </View>
  );
}
