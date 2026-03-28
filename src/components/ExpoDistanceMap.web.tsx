import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";

export default function ExpoDistanceMap() {
  const isDark = useColorScheme() === "dark";
  
  return (
    <View style={[styles.mapContainer, styles.mapFallback, isDark ? styles.bgDark : styles.bgLight]}>
      <Text style={[styles.fallbackText, isDark ? styles.textDark : styles.textLight]}>
        O react-native-maps precisa de configuração web complexa. A versão nativa não está disponível no navegador.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: 350,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  mapFallback: {
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  bgDark: { backgroundColor: "#2c2c2e" },
  bgLight: { backgroundColor: "#f0f0f0" },
  fallbackText: { textAlign: "center", fontSize: 14 },
  textDark: { color: "#aaaaaa" },
  textLight: { color: "#666666" },
});
