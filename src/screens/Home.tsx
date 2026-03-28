import { StyleSheet, Platform } from "react-native";
import { ThemedScrollView } from "../components/ThemedScrollView";
import { ThemedText } from "../components/ThemedText";
import WebViewDistanceMap from "../components/WebViewDistanceMap";
import ExpoDistanceMap from "../components/ExpoDistanceMap";
import ReverseGeocodeCard from "../components/ReverseGeocodeCard";

export function Home() {
  return (
    <ThemedScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText style={{ marginTop: 10, fontSize: 18, fontWeight: "bold" }}>
        Geocodificação Reversa
      </ThemedText>
      <ThemedText style={{ marginBottom: 8 }}>
        Converte coordenadas e informações geográficas simples em endereço.
      </ThemedText>
      <ReverseGeocodeCard />

      {Platform.OS !== "web" && (
        <>
          <ThemedText
            style={{ marginTop: 24, fontSize: 18, fontWeight: "bold" }}
          >
            Versão Nativa (Apple/Google)
          </ThemedText>
          <ThemedText style={{ marginBottom: 8 }}>
            Mapa leve renderizado usando o SDK Nativo do celular.
          </ThemedText>
          <ExpoDistanceMap
            oldLat={-3.75543}
            oldLon={-38.48734}
            newLat={-3.74182}
            newLon={-38.47023}
            // showCurrentLocation
          />
        </>
      )}

      <ThemedText style={{ marginTop: 24, fontSize: 18, fontWeight: "bold" }}>
        Versão Web (Leaflet)
      </ThemedText>
      <ThemedText style={{ marginBottom: 8 }}>
        Mapa carregado dentro de uma WebView via iframe HTML.
      </ThemedText>
      <WebViewDistanceMap
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
