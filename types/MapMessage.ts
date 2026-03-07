export type MapMessage = {
  id: string;
  userId: string;
  username: string;
  avatar?: string
  latitude: number;
  longitude: number;
  text: string;
  createdAt: string;
  imageUrl?: string;
};