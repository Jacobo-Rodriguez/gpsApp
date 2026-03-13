import MapLibreGL from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";

import { useEffect, useRef, useState, } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { useRootNavigationState, useRouter } from "expo-router";

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

  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [messages, setMessages] = useState<MapMessage[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [selectedMessage, setSelectedMessage] =
    useState<MapMessage | null>(null);

  const cameraRef = useRef<any>(null);

  /*
  MENU STATE
  */

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

  /*
  FORMAT DATE
  */

  function formatDate(date: string) {
    const d = new Date(date);

    return d.toLocaleString("es-MX", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  /*
  REDIRECT TO LOGIN IF NOT AUTHENTICATED
  */

  useEffect(() => {
    if (!navigationState?.key) return;

    if (!user) {
      requestAnimationFrame(() => {
        router.replace("./login");
      });
    }
  }, [user, navigationState]);

  /*
  LOCATION TRACKING
  */

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

  /*
  LOAD STORED MESSAGES
  */

  useEffect(() => {
    loadMessages().then(setMessages);
  }, []);

  if (!ready || !coords) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /*
  CREATE MESSAGE
  */

  async function handleCreateMessage(
    text: string,
    imageUrl?: string
  ) {

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

      {/* HAMBURGER BUTTON */}

      <TouchableOpacity
        style={styles.hamburger}
        onPress={toggleMenu}
      >
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
          onPress={() => alert("Modo visual cambiado")}
        >
          <Text style={styles.menuButtonText}>
            Alternar modo visual
          </Text>
        </TouchableOpacity>

      </Animated.View>

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

        <MapLibreGL.Camera
          ref={cameraRef}
          followUserLocation
          centerCoordinate={[
            coords.longitude,
            coords.latitude,
          ]}
          zoomLevel={18}
          minZoomLevel={16}
          maxZoomLevel={20}
          animationDuration={500}
        />

        <MapLibreGL.UserLocation
          visible
          androidRenderMode="gps"
          showsUserHeadingIndicator
        />

        {/* MESSAGE MARKERS */}

        {messages.map((msg) => (

          <MapLibreGL.PointAnnotation
            key={msg.id}
            id={msg.id}
            coordinate={[msg.longitude, msg.latitude]}
            onSelected={() => setSelectedMessage(msg)}
          >

            <Image
              source={require("../assets/images/marker.png")}
              style={styles.markerImage}
              resizeMode="contain"
            />

          </MapLibreGL.PointAnnotation>

        ))}

      </MapLibreGL.MapView>

      {/* MESSAGE POPUP */}

      {selectedMessage && (

        <View style={styles.messageOverlay}>

          <View style={styles.messageBubble}>

            <View style={styles.userHeader}>

              <View style={styles.userInfo}>

                <View style={styles.avatarCircle}>
                  {selectedMessage.avatar && (
                    <Image
                      source={{ uri: selectedMessage.avatar }}
                      style={styles.avatar}
                    />
                  )}
                </View>

                <Text style={styles.username}>
                  {selectedMessage.username}
                </Text>

              </View>

              <Text style={styles.dateText}>
                {formatDate(selectedMessage.createdAt)}
              </Text>

            </View>

            {selectedMessage.imageUrl && (

              <Image
                source={{ uri: selectedMessage.imageUrl }}
                style={styles.messageImage}
                resizeMode="contain"
              />

            )}

            {selectedMessage.text ? (

              <Text style={styles.messageText}>
                {selectedMessage.text}
              </Text>

            ) : null}

            <TouchableOpacity
              onPress={() => setSelectedMessage(null)}
            >
              <Text style={styles.closeText}>
                Close
              </Text>
            </TouchableOpacity>

          </View>

        </View>

      )}

      {/* ADD MESSAGE BUTTON */}

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

    hamburger: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,

    padding: 8,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,

    elevation: 6
  },

  hamburgerText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",

    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2
  },

  sideMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: MENU_WIDTH,
    backgroundColor: "#003c36d5",

    paddingTop: 120,
    paddingHorizontal: 20,

    zIndex: 9,
  },

  menuTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 30,
    color: "#fff"
  },

  menuButton: {
    backgroundColor: "#2fd3c5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
  },

  menuButtonText: {
    color: "#003c36",
    fontSize: 16,
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
    elevation: 6,
  },

  fabText: {
    color: "#fff",
    fontSize: 32,
    lineHeight: 32,
  },

  messageOverlay: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: "center",
  },

  messageBubble: {
    backgroundColor: "#ffffffd3",
    padding: 16,
    borderRadius: 16,
    maxWidth: "90%",
  },

  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 8,
    backgroundColor: "#eee",
  },

  avatar: {
    width: "100%",
    height: "100%",
  },

  username: {
    fontWeight: "600",
    fontSize: 15,
  },

  dateText: {
    fontSize: 12,
    color: "#777",
  },

  messageImage: {
    width: 250,
    height: 250,
    marginBottom: 10,
    borderRadius: 12,
  },

  messageText: {
    fontSize: 16,
    textAlign: "center",
  },

  closeText: {
    marginTop: 10,
    textAlign: "center",
    color: "#999",
  },

});