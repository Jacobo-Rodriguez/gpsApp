import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MapMessage } from "../types/MapMessage";

export default function MessageCard({
  message,
  onClose,
}: {
  message: MapMessage;
  onClose: () => void;
}) {

  function formatDate(date: string) {
    const d = new Date(date);
    return d.toLocaleString("es-MX", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  return (
    <View style={styles.messageOverlay}>
      <View style={styles.messageBubble}>

        {/* HEADER */}
        <View style={styles.userHeader}>

          <View style={styles.userInfo}>
            <View style={styles.avatarCircle}>
              {message.avatar && (
                <Image
                  source={{ uri: message.avatar }}
                  style={styles.avatar}
                />
              )}
            </View>

            <Text style={styles.username}>
              {message.username}
            </Text>
          </View>

          <Text style={styles.dateText}>
            {formatDate(message.createdAt)}
          </Text>

        </View>

        {/* IMAGE */}
        {message.imageUrl && (
          <Image
            source={{ uri: message.imageUrl }}
            style={styles.messageImage}
            resizeMode="contain"
          />
        )}

        {/* TEXT */}
        {message.text ? (
          <Text style={styles.messageText}>
            {message.text}
          </Text>
        ) : null}

        {/* CLOSE */}
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeText}>
            Close
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  messageOverlay: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: "center",
  },

  messageBubble: {
    backgroundColor: "#ffffffd3",
    padding: 16,
    borderRadius: 16,
    maxWidth: "90%",
  },

  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 8,
    backgroundColor: "#eee",
  },

  avatar: {
    width: "100%",
    height: "100%",
  },

  username: {
    fontWeight: "600",
    fontSize: 15,
  },

  dateText: {
    fontSize: 12,
    color: "#777",
  },

  messageImage: {
    width: 250,
    height: 250,
    marginBottom: 10,
    borderRadius: 12,
  },

  messageText: {
    fontSize: 16,
    textAlign: "center",
  },

  closeText: {
    marginTop: 10,
    textAlign: "center",
    color: "#999",
  },

});