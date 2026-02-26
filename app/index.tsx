import MapLibreGL from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, Image, StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import CreateMessageModal from "../components/CreateMessageModal";
import { loadMessages, saveMessage } from "../storage/messages";
import { MAP_STYLES } from "../styles/mapStyles";
import { MapMessage } from "../types/MapMessage";

MapLibreGL.setAccessToken(null);

export default function Home() {
  const [ready, setReady] = useState(false);
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [messages, setMessages] = useState<MapMessage[]>([]);
  const [showModal, setShowModal] = useState(false);

  const cameraRef = useRef<any>(null);

  // LOCATION TRACKING 
  useEffect(() => {
    let sub: Location.LocationSubscription;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission is required");
        return;
      }

      sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (loc) => {
          setCoords(loc.coords);
          setReady(true);
        }
      );
    })();

    return () => sub?.remove();
  }, []);

  // LOAD STORED MESSAGES
  useEffect(() => {
    loadMessages().then(setMessages);
  }, []);

  // LOADING STATE
  if (!ready || !coords) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // SAVE NEW MESSAGE
  async function handleCreateMessage(text: string) {
    if (!coords) return;

    const newMessage: MapMessage = {
      id: Date.now().toString(),
      userId: "anonymous",
      latitude: coords.latitude,
      longitude: coords.longitude,
      text,
      createdAt: new Date().toISOString(),
    };

    await saveMessage(newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setShowModal(false);
  }

  return (
    <View style={styles.container}>
      <MapLibreGL.MapView
        style={styles.map}
        mapStyle={MAP_STYLES.OSM_VOYAGER}
        rotateEnabled={false}
        pitchEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
        logoEnabled={false}
        compassEnabled={false}
      >
        {/* 🎯 CAMERA — DO NOT TOUCH */}
        <MapLibreGL.Camera
          ref={cameraRef}
          followUserLocation
          centerCoordinate={[coords.longitude, coords.latitude]}
          zoomLevel={18}
          minZoomLevel={16}
          maxZoomLevel={20}
          animationDuration={500}
        />

        {/*USER LOCATION */}
        <MapLibreGL.UserLocation
          visible
          androidRenderMode="gps"
          showsUserHeadingIndicator
        />

        {/*MESSAGE MARKERS */}
        {messages.map((msg) => (
          <MapLibreGL.PointAnnotation
          key={msg.id}
          id={msg.id}
          coordinate={[msg.longitude, msg.latitude]}
          onSelected={() => alert(msg.text)}
        >
          <Image
            source={require("../assets/images/marker.png")}
            style={styles.markerImage}
            resizeMode="contain"
          />
        </MapLibreGL.PointAnnotation>
        ))}
      </MapLibreGL.MapView>

      {/* ➕ ADD MESSAGE BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      {/* 📝 CREATE MESSAGE MODAL */}
      <CreateMessageModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateMessage}
      />
    </View>
  );
}

// 🎨 STYLES — UNCHANGED
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  markerImage: {
  width: 32,
  height: 32,
},

  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  fabText: {
    color: "#fff",
    fontSize: 32,
    lineHeight: 32,
  },
});