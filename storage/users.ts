import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/User";

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

export async function loadUsers(): Promise<User[]> {
  const data = await AsyncStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveUsers(users: User[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function registerUser(user: User) {
  const users = await loadUsers();
  users.push(user);
  await saveUsers(users);
}

export async function loginUser(email: string, password: string) {
  const users = await loadUsers();
  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) return null;

  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
}

export async function getCurrentUser(): Promise<User | null> {
  const data = await AsyncStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export async function logoutUser() {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
}