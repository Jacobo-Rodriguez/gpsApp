import { useCallback, useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";

import * as ImagePicker from "expo-image-picker";

import { useAuth } from "../context/AuthContext";
import { loadMessages } from "../storage/messages";

export default function Profile() {

  const { user, setUser } = useAuth();

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState(user?.password || "");
  const [avatar, setAvatar] = useState(user?.avatar);

  const [publishedMessages, setPublishedMessages] = useState(0);
  const [readMessages, setReadMessages] = useState(0);

  /*
  LOAD STATS EVERY TIME SCREEN OPENS
  */

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  async function loadStats() {

    const messages = await loadMessages();

    const myMessages = messages.filter(
      (m) => m.userId === user?.id
    );

    setPublishedMessages(myMessages.length);

    /* placeholder mensajes leídos */
    setReadMessages(messages.length * 2);

  }

  /*
  PICK AVATAR
  */

  async function pickImage() {

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Se necesita permiso para acceder a la galería");
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [1, 1]
      });

    if (!result.canceled) {

      const uri = result.assets[0].uri;

      setAvatar(uri);

    }

  }

  /*
  SAVE PROFILE
  */

  function handleSave() {

    if (!user) return;

    setUser({
      ...user,
        username,
        email,
        password,
        avatar
    });

    Alert.alert("Perfil actualizado");

  }

  return (

    <LinearGradient
      colors={["#003c36", "#0b0f1a"]}
      style={styles.container}
    >

      {/* BACK BUTTON */}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Perfil</Text>

      {/* AVATAR */}

      <View style={styles.avatarRow}>

        <TouchableOpacity onPress={pickImage}>

          <Image
            source={
              avatar
                ? { uri: avatar }
                : require("../assets/images/default-avatar.webp")
            }
            style={styles.avatar}
          />

        </TouchableOpacity>

        <Text style={styles.usernamePreview}>
          {username}
        </Text>

      </View>

      {/* STATS */}

      <View style={styles.statsRow}>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>
            MENSAJES PUBLICADOS
          </Text>
          <Text style={styles.statNumber}>
            {publishedMessages}
          </Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>
            MENSAJES LEIDOS
          </Text>
          <Text style={styles.statNumber}>
            {readMessages}
          </Text>
        </View>

      </View>

      {/* BUTTON */}

      <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>
          Ver lista de mensajes publicados
        </Text>
      </TouchableOpacity>

      {/* USERNAME */}

      <Text style={styles.label}>Nombre</Text>

      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <Text style={styles.label}>Email</Text>

        <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        />

        <Text style={styles.label}>Password</Text>

        <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        />

      {/* SAVE */}

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveText}>
          Save changes
        </Text>
      </TouchableOpacity>

    </LinearGradient>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 24
  },

  backButton: {
    position: "absolute",
    top: 60,
    left: 20
  },

  backText: {
    fontSize: 28,
    color: "#fff"
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 80,
    marginBottom: 20
  },

  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 16
  },

  usernamePreview: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },

  statBox: {
    backgroundColor: "#cfd8d7",
    padding: 14,
    borderRadius: 10,
    width: "48%",
    alignItems: "center"
  },

  statLabel: {
    fontSize: 11,
    color: "#333"
  },

  statNumber: {
    fontSize: 26,
    fontWeight: "700"
  },

  secondaryButton: {
    backgroundColor: "#0f5f59",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30
  },

  secondaryButtonText: {
    color: "#fff"
  },

  label: {
    color: "#fff",
    marginBottom: 6
  },

  input: {
    backgroundColor: "#e0e0e0",
    padding: 14,
    borderRadius: 8,
    marginBottom: 30
  },

  saveButton: {
    backgroundColor: "#2fd3c5",
    padding: 16,
    borderRadius: 10,
    alignItems: "center"
  },

  saveText: {
    fontSize: 16,
    fontWeight: "600"
  }

});