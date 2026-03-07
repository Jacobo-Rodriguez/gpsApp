import { useState } from "react";
import { Button, TextInput, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../storage/users";

export default function Login() {
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
  }

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}