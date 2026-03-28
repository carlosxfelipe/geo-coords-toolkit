import { StyleSheet } from "react-native";
import { ThemedScrollView } from "../components/ThemedScrollView";
import CoordinateDivergenceMap from "../components/CoordinateDivergenceMap";
import { ReverseGeocodeCard } from "../components/ReverseGeocodeCard";

export function Home() {
  return (
    <ThemedScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Exemplo: geocodificação reversa */}
      <ReverseGeocodeCard />

      {/* Exemplo: divergência de coordenadas */}
      {/* Iguatemi → RioMar Fortaleza */}
      <CoordinateDivergenceMap
        oldLat={-3.75543}
        oldLon={-38.48734}
        newLat={-3.74182}
        newLon={-38.47023}
        showCurrentLocation
      />
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    gap: 10,
  },
});
