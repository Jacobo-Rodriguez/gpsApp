import MapLibreGL from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import MessageCard from "../components/MessageCard";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import {
  useFocusEffect,
  useRootNavigationState,
  useRouter,
} from "expo-router";

import CreateMessageModal from "../components/CreateMessageModal";
import { useAuth } from "../context/AuthContext";
import { loadMessages, saveMessage } from "../storage/messages";
import { MAP_STYLES } from "../styles/mapStyles";
import { MapMessage } from "../types/MapMessage";

MapLibreGL.setAccessToken(null);

const SCREEN_WIDTH = Dimensions.get("window").width;
const MENU_WIDTH = SCREEN_WIDTH * 0.5;

export default function Home() {
  const router = useRouter();
  const navigationState = useRootNavigationState();

  const { user } = useAuth();

  const [ready, setReady] = useState(false);
  const [coords, setCoords] = useState<any>(null);

  const [messages, setMessages] = useState<MapMessage[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMessage, setSelectedMessage] =
    useState<MapMessage | null>(null);

  const cameraRef = useRef<any>(null);

  /* 🔥 CONTROL REAL DEL MAPA */
  const [mapReady, setMapReady] = useState(true);

  /* MENU */
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;

  function toggleMenu() {
    Animated.timing(slideAnim, {
      toValue: menuOpen ? -MENU_WIDTH : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();

    setMenuOpen(!menuOpen);
  }

  /* DATE */
  function formatDate(date: string) {
    return new Date(date).toLocaleString("es-MX", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  /* AUTH */
  useEffect(() => {
    if (!navigationState?.key) return;

    if (!user) {
      requestAnimationFrame(() => {
        router.replace("./login");
      });
    }
  }, [user, navigationState]);

  /* LOCATION */
  useEffect(() => {
    let sub: Location.LocationSubscription;

    (async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

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

  /* 🔥 FIX REAL */
  useFocusEffect(
    useCallback(() => {
      loadMessages().then((data) => {
        setMessages(data);

        // 🔥 fuerza render correcto del mapa
        setMapReady(false);
        setTimeout(() => setMapReady(true), 50);
      });
    }, [])
  );

  if (!ready || !coords) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /* CREATE MESSAGE */
  async function handleCreateMessage(text: string, imageUrl?: string) {
    if (!coords || !user) return;

    const newMessage: MapMessage = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      latitude: coords.latitude,
      longitude: coords.longitude,
      text,
      createdAt: new Date().toISOString(),
      imageUrl,
    };

    await saveMessage(newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setShowModal(false);
  }

  return (
    <View style={styles.container}>
      {/* HAMBURGER */}
      <TouchableOpacity style={styles.hamburger} onPress={toggleMenu}>
        <Text style={styles.hamburgerText}>☰</Text>
      </TouchableOpacity>

      {/* SIDE MENU */}
      <Animated.View
        style={[
          styles.sideMenu,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <Text style={styles.menuTitle}>Menu</Text>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("./profile")}
        >
          <Text style={styles.menuButtonText}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => alert("Modo visual")}
        >
          <Text style={styles.menuButtonText}>
            Alternar modo visual
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* MAP */}
      {mapReady && (
        <MapLibreGL.MapView
          style={styles.map}
          mapStyle={MAP_STYLES.OSM_VOYAGER}
          rotateEnabled={false}
          pitchEnabled={false}
          scrollEnabled={false}
          zoomEnabled={false}
          logoEnabled={false}
          compassEnabled={false}
          onPress={() => setSelectedMessage(null)}
        >
          {/* CAMERA */}
          <MapLibreGL.Camera
            ref={cameraRef}
            followUserLocation
            centerCoordinate={[
              coords.longitude,
              coords.latitude,
            ]}
            zoomLevel={18}
          />

          {/* USER DOT */}
          <MapLibreGL.PointAnnotation
            id="user-location"
            coordinate={[coords.longitude, coords.latitude]}
          >
            <View style={styles.userDot} />
          </MapLibreGL.PointAnnotation>


          {/*MESSAGE MARKERS */}
      <MapLibreGL.Images
        images={{
          marker: require("../assets/images/marker.png"),
        }}
      />
    <MapLibreGL.ShapeSource
      id="messages-source"
      shape={{
        type: "FeatureCollection",
        features: messages.map((msg) => ({
          type: "Feature",
          id: msg.id,
          properties: {
            id: msg.id,
          },
          geometry: {
            type: "Point",
            coordinates: [msg.longitude, msg.latitude],
          },
        })),
      }}
            onPress={(e) => {
        const feature = e.features?.[0] as {
          properties?: { id?: string };
        };

        const id = feature?.properties?.id;

        if (!id) return;

        const msg = messages.find((m) => m.id === id);

        if (msg) setSelectedMessage(msg);
      }}
    >
      <MapLibreGL.SymbolLayer
        id="messages-layer"
        style={{
          iconImage: "marker",
          iconSize: 0.09,
          iconAllowOverlap: true,
        }}
      />
    </MapLibreGL.ShapeSource>
        </MapLibreGL.MapView>
      )}

      {/* MESSAGE CARD */}
      {selectedMessage && (
        <MessageCard
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      <CreateMessageModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateMessage}
      />
    </View>
  );
}

/* STYLES */
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

  userDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#007AFF",
    borderWidth: 3,
    borderColor: "#fff",
  },

  hamburger: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
  },

  hamburgerText: {
    fontSize: 32,
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowRadius: 4,
  },

  sideMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: MENU_WIDTH,
    backgroundColor: "#003c36",
    paddingTop: 120,
    paddingHorizontal: 20,
    zIndex: 9,
  },

  menuTitle: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 20,
  },

  menuButton: {
    backgroundColor: "#2fd3c5",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },

  menuButtonText: {
    color: "#003c36",
    fontWeight: "600",
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
  },

  fabText: {
    color: "#fff",
    fontSize: 30,
  },
});