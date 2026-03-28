import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  useColorScheme,
} from "react-native";
import { haversineDistance, formatDistance } from "../utils/haversine";
import { convertToDMS } from "../utils/convert-to-dms";

interface CoordinateDivergenceMapProps {
  oldLat: number;
  oldLon: number;
  newLat: number;
  newLon: number;
  mapHeight?: number;
  borderRadius?: number;
  showCurrentLocation?: boolean;
}

/**
 * Gera o HTML do mapa Leaflet com dois marcadores e uma linha de divergência.
 */
function buildMapHTML(
  oldLat: number,
  oldLon: number,
  newLat: number,
  newLon: number,
  distance: string,
  isDark: boolean,
  showCurrentLocation: boolean,
) {
  const centerLat = (oldLat + newLat) / 2;
  const centerLon = (oldLon + newLon) / 2;

  // Calcula zoom baseado na distância
  const latDiff = Math.abs(oldLat - newLat);
  const lonDiff = Math.abs(oldLon - newLon);
  const maxDiff = Math.max(latDiff, lonDiff);
  let zoom = 15;
  if (maxDiff > 10) zoom = 4;
  else if (maxDiff > 5) zoom = 5;
  else if (maxDiff > 2) zoom = 6;
  else if (maxDiff > 1) zoom = 7;
  else if (maxDiff > 0.5) zoom = 9;
  else if (maxDiff > 0.1) zoom = 11;
  else if (maxDiff > 0.01) zoom = 14;
  else if (maxDiff > 0.001) zoom = 16;
  else zoom = 18;

  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const tileAttribution = isDark
    ? '&copy; <a href="https://carto.com/">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; }
    #map { width: 100%; height: 100%; }

    .custom-marker {
      width: 14px; height: 14px;
      border-radius: 50%;
      border: 2.5px solid #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.35);
    }
    .marker-old { background: #ff6b6b; }
    .marker-new { background: #51cf66; }
    .marker-current {
      background: #339af0;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(51,154,240,0.5), 0 2px 8px rgba(0,0,0,0.35); }
      50% { box-shadow: 0 0 0 8px rgba(51,154,240,0), 0 2px 8px rgba(0,0,0,0.35); }
    }

    .distance-label {
      background: none;
      color: #e67700;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      font-weight: 800;
      white-space: nowrap;
      border: none;
      text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 0 6px rgba(255,255,255,0.8);
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      zoomControl: false,
      attributionControl: true,
    }).setView([${centerLat}, ${centerLon}], ${zoom});

    L.tileLayer('${tileUrl}', {
      attribution: '${tileAttribution}',
      maxZoom: 19,
    }).addTo(map);

    var oldIcon = L.divIcon({
      className: '',
      html: '<div class="custom-marker marker-old"></div>',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    var newIcon = L.divIcon({
      className: '',
      html: '<div class="custom-marker marker-new"></div>',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    L.marker([${oldLat}, ${oldLon}], { icon: oldIcon })
      .addTo(map)
      .bindPopup('<b>Coordenada Antiga</b><br>${oldLat.toFixed(6)}, ${oldLon.toFixed(6)}');

    L.marker([${newLat}, ${newLon}], { icon: newIcon })
      .addTo(map)
      .bindPopup('<b>Coordenada Nova</b><br>${newLat.toFixed(6)}, ${newLon.toFixed(6)}');

    var polyline = L.polyline(
      [[${oldLat}, ${oldLon}], [${newLat}, ${newLon}]],
      {
        color: '#ffd43b',
        weight: 3,
        dashArray: '8, 6',
        opacity: 0.9,
      }
    ).addTo(map);

    var midPoint = L.latLng(${centerLat}, ${centerLon});
    L.marker(midPoint, {
      icon: L.divIcon({
        className: '',
        html: '<div class="distance-label">${distance}</div>',
        iconSize: [0, 0],
        iconAnchor: [0, -10],
      }),
      interactive: false,
    }).addTo(map);

    map.fitBounds(polyline.getBounds().pad(0.3));

    ${showCurrentLocation ? `
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        var curLat = pos.coords.latitude;
        var curLon = pos.coords.longitude;
        var curIcon = L.divIcon({
          className: '',
          html: '<div class="custom-marker marker-current"></div>',
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        L.marker([curLat, curLon], { icon: curIcon })
          .addTo(map)
          .bindPopup('<b>Sua Localização</b><br>' + curLat.toFixed(6) + ', ' + curLon.toFixed(6));
      });
    }
    ` : ''}
  </script>
</body>
</html>`;
}

export function CoordinateDivergenceMap({
  oldLat,
  oldLon,
  newLat,
  newLon,
  mapHeight = 350,
  borderRadius = 16,
  showCurrentLocation = false,
}: CoordinateDivergenceMapProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const distance = useMemo(
    () => haversineDistance(oldLat, oldLon, newLat, newLon),
    [oldLat, oldLon, newLat, newLon],
  );

  const distanceText = formatDistance(distance);

  const oldDMS = `${convertToDMS(oldLat, "lat")} ${convertToDMS(oldLon, "lon")}`;
  const newDMS = `${convertToDMS(newLat, "lat")} ${convertToDMS(newLon, "lon")}`;

  const mapHtml = useMemo(
    () => buildMapHTML(oldLat, oldLon, newLat, newLon, distanceText, isDark, showCurrentLocation),
    [oldLat, oldLon, newLat, newLon, distanceText, isDark, showCurrentLocation],
  );

  const renderMap = () => {
    if (Platform.OS === "web") {
      return (
        <View style={styles.mapContainer}>
          <iframe
            srcDoc={mapHtml}
            style={{
              width: "100%",
              height: mapHeight,
              border: "none",
              borderRadius,
            }}
            title="Mapa de Divergência"
          />
        </View>
      );
    }

    // Para mobile, precisaria de react-native-webview
    // Importação condicional para evitar erro na web
    try {
      const { WebView } = require("react-native-webview");
      return (
        <View style={styles.mapContainer}>
          <WebView
            source={{ html: mapHtml }}
            style={{ height: mapHeight, borderRadius }}
            scrollEnabled={false}
            javaScriptEnabled
            domStorageEnabled
          />
        </View>
      );
    } catch {
      return (
        <View style={[styles.mapContainer, styles.mapFallback]}>
          <Text style={[styles.fallbackText, isDark && styles.textDark]}>
            Instale react-native-webview para visualizar o mapa no dispositivo.
          </Text>
        </View>
      );
    }
  };

  const styles = createStyles(isDark, mapHeight, borderRadius);

  return (
    <View style={styles.container}>
      {/* Mapa */}
      {renderMap()}

      {/* Card de informações */}
      <View style={styles.infoCard}>
        {/* Distância */}
        <View style={styles.distanceRow}>
          <Text style={styles.distanceLabel}>Divergência</Text>
          <Text style={styles.distanceValue}>{distanceText}</Text>
        </View>

        <View style={styles.divider} />

        {/* Coordenadas */}
        <View style={styles.coordsContainer}>
          {/* Antiga */}
          <View style={styles.coordRow}>
            <View style={[styles.dot, { backgroundColor: "#ff6b6b" }]} />
            <View style={styles.coordInfo}>
              <Text style={styles.coordLabel}>Antiga</Text>
              <Text style={styles.coordValue}>
                {oldLat.toFixed(6)}, {oldLon.toFixed(6)}
              </Text>
              <Text style={styles.coordDMS}>{oldDMS}</Text>
            </View>
          </View>

          {/* Nova */}
          <View style={styles.coordRow}>
            <View style={[styles.dot, { backgroundColor: "#51cf66" }]} />
            <View style={styles.coordInfo}>
              <Text style={styles.coordLabel}>Nova</Text>
              <Text style={styles.coordValue}>
                {newLat.toFixed(6)}, {newLon.toFixed(6)}
              </Text>
              <Text style={styles.coordDMS}>{newDMS}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const createStyles = (isDark: boolean, mapHeight: number, borderRadius: number) =>
  StyleSheet.create({
    container: {
      gap: 16,
    },
    mapContainer: {
      borderRadius,
      overflow: "hidden",
      height: mapHeight,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },
        android: {
          elevation: 6,
        },
        web: {
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
      }),
    },
    mapFallback: {
      backgroundColor: isDark ? "#2c2c2e" : "#f0f0f0",
      justifyContent: "center",
      alignItems: "center",
    },
    fallbackText: {
      color: "#666",
      fontSize: 14,
      textAlign: "center",
      paddingHorizontal: 20,
    },
    textDark: {
      color: "#aaa",
    },
    infoCard: {
      backgroundColor: isDark ? "#1c1c1e" : "#ffffff",
      borderRadius,
      padding: 20,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        },
      }),
    },
    distanceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    distanceLabel: {
      fontSize: 15,
      fontWeight: "600",
      color: isDark ? "#ebebf5" : "#3a3a3c",
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    distanceValue: {
      fontSize: 22,
      fontWeight: "700",
      color: isDark ? "#ffd43b" : "#e67700",
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: isDark ? "#3a3a3c" : "#e0e0e0",
      marginVertical: 16,
    },
    coordsContainer: {
      gap: 14,
    },
    coordRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginTop: 4,
    },
    coordInfo: {
      flex: 1,
    },
    coordLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: isDark ? "#ebebf5" : "#3a3a3c",
      marginBottom: 2,
    },
    coordValue: {
      fontSize: 14,
      fontWeight: "500",
      fontVariant: ["tabular-nums"],
      color: isDark ? "#ffffff" : "#1c1c1e",
    },
    coordDMS: {
      fontSize: 12,
      color: isDark ? "#98989d" : "#8e8e93",
      marginTop: 2,
      fontVariant: ["tabular-nums"],
    },
  });

export default CoordinateDivergenceMap;
