import AsyncStorage from "@react-native-async-storage/async-storage";
import { MapMessage } from "../types/MapMessage";

const KEY = "MAP_MESSAGES";

export async function loadMessages(): Promise<MapMessage[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveMessage(message: MapMessage) {
  const messages = await loadMessages();
  messages.push(message);
  await AsyncStorage.setItem(KEY, JSON.stringify(messages));
}