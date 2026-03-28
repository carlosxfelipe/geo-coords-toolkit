import { StyleSheet, ScrollView, View, Linking } from "react-native";
import { useTheme } from "@react-navigation/native";
import { ThemedView } from "../components/ThemedView";
import { ThemedText } from "../components/ThemedText";
import { Icon } from "../components/Icon";
import { Button } from "../components/Button";

export function About() {
  const { colors } = useTheme();

  const handleOpenGithub = () => {
    Linking.openURL("https://github.com/carlosxfelipe/geo-coords-toolkit");
  };

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Geo Coords Toolkit</ThemedText>

        <View style={styles.sectionHeader}>
          <Icon
            type="MaterialCommunityIcons"
            name="package-variant"
            color={colors.primary}
            size={24}
          />
          <ThemedText style={[styles.sectionTitle, { color: colors.primary }]}>
            Componentes
          </ThemedText>
        </View>
        <ThemedText style={styles.item}>
          • ReverseGeocodeCard: Busca de endereços de forma interativa.
        </ThemedText>
        <ThemedText style={styles.item}>
          • NativeDistanceMap: Mapas nativos com Google Maps (Android) e Apple
          Maps (iOS).
        </ThemedText>
        <ThemedText style={styles.item}>
          • WebViewDistanceMap: Fallback universal de mapas usando Leaflet.
        </ThemedText>

        <View style={styles.sectionHeader}>
          <Icon
            type="MaterialCommunityIcons"
            name="function-variant"
            color={colors.primary}
            size={24}
          />
          <ThemedText style={[styles.sectionTitle, { color: colors.primary }]}>
            Funções Utilitárias
          </ThemedText>
        </View>
        <ThemedText style={styles.item}>
          • Conversão DMS: Formatação de coordenadas para graus, minutos e
          segundos.
        </ThemedText>
        <ThemedText style={styles.item}>
          • Reverse Geocode: Módulo para descobrir endereços via Nominatim API.
        </ThemedText>
        <ThemedText style={styles.item}>
          • Haversine: Cálculo preciso de distância geodésica entre dois pontos.
        </ThemedText>

        <View style={styles.buttonContainer}>
          <Button
            variant="filled"
            onPress={handleOpenGithub}
            iconLeft={(color) => (
              <Icon
                type="MaterialCommunityIcons"
                name="github"
                color={color}
                size={22}
              />
            )}
            style={styles.githubButton}
          >
            Ver no GitHub
          </Button>
        </View>

        <ThemedText style={styles.footer}>
          Este projeto utiliza Continuous Native Generation (CNG) do Expo. As
          pastas nativas são automáticas e gerenciadas via plugins.
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  item: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
    paddingLeft: 4,
  },
  buttonContainer: {
    marginTop: 32,
    alignItems: "center",
  },
  githubButton: {
    width: "100%",
  },
  footer: {
    fontSize: 13,
    marginTop: 40,
    opacity: 0.5,
    fontStyle: "italic",
    textAlign: "center",
  },
});
