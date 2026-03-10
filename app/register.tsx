import { router } from "expo-router";
import { useState } from "react";
import { Button, TextInput, View } from "react-native";
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
    <View style={{ padding: 20 }}>

      <TextInput
        placeholder="Username"
        onChangeText={setUsername}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

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

      <Button title="Create account" onPress={handleRegister} />

    </View>
  );
}