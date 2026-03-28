export default ({ config }) => {
  return {
    ...config,
    android: {
      ...config.android,
      config: {
        ...config.android?.config,
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY || "CHAVE_NAO_ENCONTRADA_NO_ENV"
        }
      }
    },
    plugins: [
      ...(config.plugins || []).filter(p => p !== "react-native-maps"),
      [
        "react-native-maps",
        {
          androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "CHAVE_NAO_ENCONTRADA_NO_ENV"
        }
      ]
    ]
  };
};
