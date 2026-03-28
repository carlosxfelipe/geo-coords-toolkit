import { StyleSheet } from "react-native";
import { ThemedScrollView } from "../components/ThemedScrollView";
import { ThemedText } from "../components/ThemedText";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import CoordinateDivergenceMap from "../components/CoordinateDivergenceMap";

export function Home() {
  return (
    <ThemedScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText>Tela Inicial</ThemedText>
      <ThemedText>
        Abra o arquivo 'src/App.tsx' para começar a trabalhar no seu app!
      </ThemedText>

      <Button
        screen="Profile"
        params={{ user: "carlos" }}
        iconLeft={(color) => <Icon type="Feather" name="user" color={color} />}
      >
        Ir para o Perfil
      </Button>

      <Button
        screen="Settings"
        iconRight={(color) => (
          <Icon type="Ionicons" name="settings-outline" color={color} />
        )}
      >
        Ir para as Configurações
      </Button>

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
