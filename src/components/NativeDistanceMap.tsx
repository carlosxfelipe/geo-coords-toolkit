import React, { useMemo } from "react";
import { View, Text, StyleSheet, Platform, useColorScheme } from "react-native";
import { haversineDistance, formatDistance } from "../utils/haversine";
import { convertToDMS } from "../utils/convert-to-dms";
import { Icon } from "./Icon";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

const COLORS = {
  white: "#ffffff",
  black: "#000000",
  oldMarker: "#ff6b6b",
  newMarker: "#51cf66",
  distanceLight: "#e67700",
  distanceDark: "#ffd43b",
  bgFallbackDark: "#2c2c2e",
  bgFallbackLight: "#f0f0f0",
  textFallbackDark: "#aaaaaa",
  textFallbackLight: "#666666",
  cardBgDark: "#1c1c1e",
  cardBgLight: "#ffffff",
  textPrimaryDark: "#ebebf5",
  textPrimaryLight: "#3a3a3c",
  textSecondaryDark: "#98989d",
  textSecondaryLight: "#8e8e93",
  dividerDark: "#3a3a3c",
  dividerLight: "#e0e0e0",
  shadowCardWeb: "rgba(0,0,0,0.1)",
  shadowMapWeb: "rgba(0,0,0,0.15)",
};

interface NativeDistanceMapProps {
  oldLat: number;
  oldLon: number;
  newLat: number;
  newLon: number;
  mapHeight?: number;
  borderRadius?: number;
}

export default function NativeDistanceMap({
  oldLat,
  oldLon,
  newLat,
  newLon,
  mapHeight = 350,
  borderRadius = 16,
}: NativeDistanceMapProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const distanceText = useMemo(
    () => formatDistance(haversineDistance(oldLat, oldLon, newLat, newLon)),
    [oldLat, oldLon, newLat, newLon],
  );

  const oldDMS = `${convertToDMS(oldLat, "lat")} ${convertToDMS(oldLon, "lon")}`;
  const newDMS = `${convertToDMS(newLat, "lat")} ${convertToDMS(newLon, "lon")}`;

  const styles = createStyles(isDark, mapHeight, borderRadius);

  // Calcula região baseada nos pontos
  const region = useMemo(() => {
    const latDiff = Math.abs(oldLat - newLat);
    const lonDiff = Math.abs(oldLon - newLon);
    return {
      latitude: (oldLat + newLat) / 2,
      longitude: (oldLon + newLon) / 2,
      latitudeDelta: Math.max(latDiff * 1.5, 0.01),
      longitudeDelta: Math.max(lonDiff * 1.5, 0.01),
    };
  }, [oldLat, oldLon, newLat, newLon]);

  const renderMap = () => {
    if (Platform.OS === "web") {
      return (
        <View style={[styles.mapContainer, styles.mapFallback]}>
          <Text style={[styles.fallbackText, isDark && styles.textDark]}>
            O react-native-maps precisa de configuração adicional na Web. Utilize um dispositivo nativo para visualizar este mapa completo.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.mapContainer}>
        <MapView
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={styles.map}
          initialRegion={region}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <Marker
            coordinate={{ latitude: oldLat, longitude: oldLon }}
            title="Antiga"
            pinColor={COLORS.oldMarker}
          />
          <Marker
            coordinate={{ latitude: newLat, longitude: newLon }}
            title="Nova"
            pinColor={COLORS.newMarker}
          />
          <Polyline
            coordinates={[
              { latitude: oldLat, longitude: oldLon },
              { latitude: newLat, longitude: newLon },
            ]}
            strokeColor={isDark ? COLORS.distanceDark : COLORS.distanceLight}
            strokeWidth={3}
            lineDashPattern={[8, 6]}
          />
        </MapView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderMap()}

      <View style={styles.infoCard}>
        <View style={styles.distanceRow}>
          <Text style={styles.distanceLabel}>Divergência</Text>
          <Text style={styles.distanceValue}>{distanceText}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.coordsContainer}>
          <View style={styles.coordRow}>
            <Icon
              type="MaterialCommunityIcons"
              name="map-marker-outline"
              color={COLORS.oldMarker}
              size={20}
              style={styles.icon}
            />
            <View style={styles.coordInfo}>
              <Text style={styles.coordLabel}>Antiga</Text>
              <Text style={styles.coordValue}>
                {oldLat.toFixed(6)}, {oldLon.toFixed(6)}
              </Text>
              <Text style={styles.coordDMS}>{oldDMS}</Text>
            </View>
          </View>

          <View style={styles.coordRow}>
            <Icon
              type="MaterialCommunityIcons"
              name="map-marker"
              color={COLORS.newMarker}
              size={20}
              style={styles.icon}
            />
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

const createStyles = (
  isDark: boolean,
  mapHeight: number,
  borderRadius: number,
) =>
  StyleSheet.create({
    container: {
      gap: 16,
    },
    mapContainer: {
      borderRadius,
      overflow: "hidden",
      height: mapHeight,
      position: "relative",
      backgroundColor: COLORS.bgFallbackLight,
      ...Platform.select({
        ios: {
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },
        android: {
          elevation: 6,
        },
        web: {
          boxShadow: `0 4px 12px ${COLORS.shadowMapWeb}`,
        },
      }),
    },
    map: {
      width: "100%",
      height: "100%",
    },
    mapFallback: {
      backgroundColor: isDark ? COLORS.bgFallbackDark : COLORS.bgFallbackLight,
      justifyContent: "center",
      alignItems: "center",
    },
    fallbackText: {
      color: COLORS.textFallbackLight,
      fontSize: 14,
      textAlign: "center",
      paddingHorizontal: 20,
    },
    textDark: {
      color: COLORS.textFallbackDark,
    },
    infoCard: {
      backgroundColor: isDark ? COLORS.cardBgDark : COLORS.cardBgLight,
      borderRadius,
      padding: 20,
      ...Platform.select({
        ios: {
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: `0 2px 8px ${COLORS.shadowCardWeb}`,
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
      color: isDark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    distanceValue: {
      fontSize: 22,
      fontWeight: "700",
      color: isDark ? COLORS.distanceDark : COLORS.distanceLight,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: isDark ? COLORS.dividerDark : COLORS.dividerLight,
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
    icon: {
      marginTop: 2,
    },
    coordInfo: {
      flex: 1,
    },
    coordLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: isDark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight,
      marginBottom: 2,
    },
    coordValue: {
      fontSize: 14,
      fontWeight: "500",
      fontVariant: ["tabular-nums"],
      color: isDark ? COLORS.white : COLORS.cardBgDark,
    },
    coordDMS: {
      fontSize: 12,
      color: isDark ? COLORS.textSecondaryDark : COLORS.textSecondaryLight,
      marginTop: 2,
      fontVariant: ["tabular-nums"],
    },
  });
