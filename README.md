# Geo Coords Toolkit 🌍

Conjunto de componentes e utilitários especializados no tratamento, cálculo e visualização de coordenadas geográficas para React Native e Web.

## 📦 Componentes Principais

O toolkit disponibiliza componentes prontos para uso em telas de geolocalização:

- **`ReverseGeocodeCard`**: Interface interativa para geocodificação reversa de endereços.
- **`NativeDistanceMap`**: Visualização nativa de divergência entre pontos utilizando os SDKs originais de cada plataforma (**Google Maps no Android** e **Apple Maps no iOS**).
- **`WebViewDistanceMap`**: Fallback universal para visualização de mapas via Leaflet em WebViews.

## 🛠️ Funções e Lógica de Cálculo
Para cálculos de distância (Haversine), conversão de graus (DMS) e outras utilidades matemáticas:
👉 **[Veja o Guia Completo de Utilitários (src/utils/README.md)](./src/utils/README.md)**

---

## 🚀 Como Executar o Projeto

1. **Setup Inicial:**
   ```bash
   git clone https://github.com/carlosxfelipe/geo-coords-toolkit.git
   cd geo-coords-toolkit
   npm install
   ```

2. **Credenciais do Mapa (Android):**
   Crie um arquivo `.env` na raiz do projeto com sua Google Maps API Key para que o mapa funcione no Android (o iOS utiliza Apple Maps nativo e não requer chave):
   ```env
   GOOGLE_MAPS_API_KEY=SUA_CHAVE_AQUI
   ```

3. **Rodar em Diferentes Plataformas:**
   - **Android:** `npm run android`
   - **iOS:** `npm run ios`
   - **Web:** `npm run web`

## 📁 Estrutura Nativa
As pastas `android/` e `ios/` são autogeradas (CNG) e estão protegidas no `.gitignore`. Gerencie chaves e permissões apenas via `.env` ou `app.json`.
