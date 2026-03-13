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

import { useAuth } from "../context/AuthContext";
import { loginUser } from "../storage/users";

export default function LoginScreen() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useAuth();

  async function handleLogin() {

    const user = await loginUser(email, password);

    if (!user) {
      alert("Invalid credentials");
      return;
    }

    setUser(user);
    router.replace("/");

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
            Welcome back to
          </Text>
        </View>

        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />

      </View>

      {/* FORM */}

      <View style={styles.form}>

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

        <TouchableOpacity>
          <Text style={styles.forgot}>
            Forgot password?
          </Text>
        </TouchableOpacity>

        {/* LOGIN BUTTON */}

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        >

          <Text style={styles.buttonText}>
            Log In
          </Text>

        </TouchableOpacity>

        {/* REGISTER LINK */}

        <View style={styles.registerRow}>

          <Text style={{ color: "#aaa" }}>
            Don't have an account?
          </Text>

          <TouchableOpacity
            onPress={() => router.push("./register")}
          >
            <Text style={styles.signup}>
              Sign up
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
    marginBottom: 60,
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
    width: 200,
    height: 200,
    resizeMode: "contain",
  },

  form: {},

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

  forgot: {
    color: "#2fd3c5",
    textAlign: "right",
    marginBottom: 30,
  },

  button: {
    backgroundColor: "#2fd3c5",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },

  signup: {
    color: "#2fd3c5",
    marginLeft: 6,
    fontWeight: "600",
  },

});