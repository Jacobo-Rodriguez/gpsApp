import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { registerUser } from "../storage/users";

export default function RegisterScreen() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password,
      avatar: "https://i.pravatar.cc/150"
    };

    await registerUser(newUser);

    alert("User created");

    router.replace("./login");
  }

  return (

    <LinearGradient
      colors={["#003c36", "#0b0f1a"]}
      style={styles.container}
    >

      {/* HEADER */}

      <View style={styles.header}>

        <View>
          <Text style={styles.hello}>Hello.</Text>
          <Text style={styles.welcome}>
            Create your account
          </Text>
        </View>

        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />

      </View>

      {/* FORM */}

      <View style={styles.form}>

        {/* TITLE */}

        <Text style={styles.registerTitle}>
          Register
        </Text>

        <Text style={styles.label}>Username</Text>

        <TextInput
          placeholder="Enter username"
          placeholderTextColor="#999"
          style={styles.input}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Email</Text>

        <TextInput
          placeholder="Enter email"
          placeholderTextColor="#999"
          style={styles.input}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>

        <TextInput
          placeholder="Enter password"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>
            Create Account
          </Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>

          <Text style={{ color: "#aaa" }}>
            Already have an account?
          </Text>

          <TouchableOpacity
            onPress={() => router.push("./login")}
          >
            <Text style={styles.loginLink}>
              Log in
            </Text>
          </TouchableOpacity>

        </View>

      </View>

    </LinearGradient>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },

  hello: {
    fontSize: 40,
    color: "white",
    fontWeight: "700",
  },

  welcome: {
    color: "#ccc",
    marginTop: 5,
  },

  logo: {
    width: 160,
    height: 160,
    resizeMode: "contain",
  },

  form: {},

  registerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginBottom: 20,
  },

  label: {
    color: "#ddd",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#eee",
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },

  button: {
    backgroundColor: "#2fd3c5",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },

  loginLink: {
    color: "#2fd3c5",
    marginLeft: 6,
    fontWeight: "600",
  },

});