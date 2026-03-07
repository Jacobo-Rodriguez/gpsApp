import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Button, TextInput, View } from "react-native";
import { registerUser } from "../storage/users";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");

  async function pickAvatar() {
    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  }

  async function handleRegister() {
    const user = {
      id: Date.now().toString(),
      username,
      email,
      password,
      avatar,
    };

    await registerUser(user);
    alert("User created");
  }

  return (
    <View>
      <TextInput placeholder="Username" onChangeText={setUsername} />
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Pick avatar" onPress={pickAvatar} />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}