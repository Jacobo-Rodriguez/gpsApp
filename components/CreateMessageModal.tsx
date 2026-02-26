import { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
};

export default function CreateMessageModal({
  visible,
  onClose,
  onSubmit,
}: Props) {
  const [text, setText] = useState("");

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>New message</Text>

          <TextInput
            style={styles.input}
            placeholder="Write something..."
            value={text}
            onChangeText={setText}
            multiline
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (!text.trim()) return;
                onSubmit(text);
                setText("");
              }}
            >
              <Text style={styles.save}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  box: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  input: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancel: { color: "#999", fontSize: 16 },
  save: { color: "#000", fontSize: 16, fontWeight: "600" },
});