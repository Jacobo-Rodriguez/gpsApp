import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
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
  onSubmit: (text: string, imageUrl?: string) => void; // 👈 updated
};

export default function CreateMessageModal({
  visible,
  onClose,
  onSubmit,
}: Props) {
  const [text, setText] = useState("");
  const [imageUrl, setimageUrl] = useState<string | null>(null);

  async function pickImage() {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required to access gallery");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setimageUrl(result.assets[0].uri);
    }
  }

  function handleSave() {
    if (!text.trim() && !imageUrl) return;

    onSubmit(text.trim(), imageUrl ?? undefined);

    // reset state
    setText("");
    setimageUrl(null);
  }

  function handleClose() {
    setText("");
    setimageUrl(null);
    onClose();
  }

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

          {/* 📷 IMAGE BUTTON */}
          <TouchableOpacity
            style={styles.imageButton}
            onPress={pickImage}
          >
            <Text style={styles.imageButtonText}>
              {imageUrl ? "Change Image" : "Add Image"}
            </Text>
          </TouchableOpacity>

          {/* 🖼 IMAGE PREVIEW */}
          {imageUrl && (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.previewImage}
                resizeMode="contain"
              />

              <TouchableOpacity
                onPress={() => setimageUrl(null)}
              >
                <Text style={styles.removeImage}>
                  Remove Image
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSave}>
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
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
  },

  imageButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
  },

  imageButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },

  previewContainer: {
    marginTop: 12,
    alignItems: "center",
  },

  previewImage: {
    width: 250,   // ~60% visual size
    height: 250,
    marginBottom: 6,
  },

  removeImage: {
    color: "red",
    fontSize: 14,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },

  cancel: {
    color: "#999",
    fontSize: 16,
  },

  save: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },

});