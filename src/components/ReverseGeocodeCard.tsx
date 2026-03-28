import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Keyboard,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import type { Theme as AppTheme } from "../themes";
import { ThemedText } from "./ThemedText";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Skeleton } from "./Skeleton";
import { reverseGeocode } from "../utils/reverse-geocode";

interface GeoResult {
  displayName: string;
  city: string | undefined;
  state: string | undefined;
  country: string | undefined;
}

export function ReverseGeocodeCard() {
  const theme = useTheme() as AppTheme;
  const { colors, fonts, dark } = theme;

  const [lat, setLat] = useState("-3.85529");
  const [lng, setLng] = useState("-38.60132");
  const [result, setResult] = useState<GeoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    Keyboard.dismiss();
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      setError("Informe coordenadas válidas.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await reverseGeocode(latNum, lngNum);
      setResult(data);
    } catch (err: any) {
      setError(err.message ?? "Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.inputBackground,
      color: colors.text,
      borderColor: colors.border,
      ...fonts.regular,
    },
  ];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <Icon type="Ionicons" name="location-outline" color={colors.primary} size={20} />
        <ThemedText style={[styles.title, { color: colors.text }, fonts.bold]}>
          Geocodificação Reversa
        </ThemedText>
      </View>

      <ThemedText style={[styles.subtitle, { color: colors.placeholder }]}>
        Informe latitude e longitude para descobrir o endereço correspondente.
      </ThemedText>

      {/* Inputs */}
      <View style={styles.inputRow}>
        <View style={styles.inputWrapper}>
          <ThemedText style={[styles.label, { color: colors.placeholder }, fonts.medium]}>
            Latitude
          </ThemedText>
          <TextInput
            style={inputStyle}
            value={lat}
            onChangeText={setLat}
            keyboardType="numeric"
            placeholder="-3.85529"
            placeholderTextColor={colors.placeholder}
          />
        </View>

        <View style={styles.inputWrapper}>
          <ThemedText style={[styles.label, { color: colors.placeholder }, fonts.medium]}>
            Longitude
          </ThemedText>
          <TextInput
            style={inputStyle}
            value={lng}
            onChangeText={setLng}
            keyboardType="numeric"
            placeholder="-38.60132"
            placeholderTextColor={colors.placeholder}
          />
        </View>
      </View>

      {/* Button */}
      <Button
        onPress={handleSearch}
        iconLeft={(color) => (
          <Icon type="Ionicons" name="search" color={color} size={18} />
        )}
      >
        Buscar Endereço
      </Button>

      {/* Loading */}
      {loading && (
        <View style={styles.resultBox}>
          <Skeleton width="100%" height={16} borderRadius={4} />
          <Skeleton width="70%" height={16} borderRadius={4} />
          <Skeleton width="85%" height={16} borderRadius={4} />
        </View>
      )}

      {/* Error */}
      {error && (
        <View style={[styles.resultBox, styles.errorBox]}>
          <ThemedText style={[styles.errorText, fonts.medium]}>
            {error}
          </ThemedText>
        </View>
      )}

      {/* Result */}
      {result && !loading && (
        <View style={[styles.resultBox, { backgroundColor: dark ? "#0A84FF10" : "#0A84FF08" }]}>
          <ResultRow
            icon="navigate-outline"
            label="Endereço"
            value={result.displayName}
            colors={colors}
            fonts={fonts}
          />
          {result.city && (
            <ResultRow
              icon="business-outline"
              label="Cidade"
              value={result.city}
              colors={colors}
              fonts={fonts}
            />
          )}
          {result.state && (
            <ResultRow
              icon="map-outline"
              label="Estado"
              value={result.state}
              colors={colors}
              fonts={fonts}
            />
          )}
          {result.country && (
            <ResultRow
              icon="globe-outline"
              label="País"
              value={result.country}
              colors={colors}
              fonts={fonts}
            />
          )}
        </View>
      )}
    </View>
  );
}

function ResultRow({
  icon,
  label,
  value,
  colors,
  fonts,
}: {
  icon: string;
  label: string;
  value: string;
  colors: any;
  fonts: any;
}) {
  return (
    <View style={styles.resultRow}>
      <Icon type="Ionicons" name={icon as any} color={colors.primary} size={16} />
      <View style={styles.resultTextWrapper}>
        <ThemedText style={[styles.resultLabel, { color: colors.placeholder }, fonts.medium]}>
          {label}
        </ThemedText>
        <ThemedText style={[styles.resultValue, { color: colors.text }]}>
          {value}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: -4,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  resultBox: {
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  errorBox: {
    backgroundColor: "rgba(255, 69, 58, 0.08)",
  },
  errorText: {
    color: "#FF453A",
    fontSize: 14,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingTop: 2,
  },
  resultTextWrapper: {
    flex: 1,
    gap: 2,
  },
  resultLabel: {
    fontSize: 11,
    lineHeight: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  resultValue: {
    fontSize: 14,
    lineHeight: 20,
  },
});
