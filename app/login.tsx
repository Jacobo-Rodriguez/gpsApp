import { router } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
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

    <View style={{ padding: 20 }}>

      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Button title="Login" onPress={handleLogin} />

      <Text style={{ marginTop: 20 }}>Don't have an account?</Text>

      <Button
        title="Register"
        onPress={() => router.push("/register" as any)}
      />

    </View>

  );

}