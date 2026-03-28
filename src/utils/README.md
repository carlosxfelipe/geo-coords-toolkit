# Geo Coords Utils 🧩

Biblioteca de funções utilitárias para manipulação de dados geoespaciais e cálculos geodésicos.

## Conversão para DMS 📐

Converte coordenadas decimais (latitude/longitude) para o formato DMS (Graus, Minutos e Segundos).

```typescript
// Coordenadas aproximadas da fábrica da Coca-Cola (Solar) em Maracanaú
const lat = -3.8527093961210848;
const lng = -38.60132752534783;

console.log(formatLatLngToDMS(lat, lng, { decimals: 1 }));
// 3°51'09.8"S 38°36'04.8"O
```

As direções cardeais usam abreviações em português: **N** (Norte), **S** (Sul), **L** (Leste) e **O** (Oeste).

## Geocodificação reversa 📍

O módulo `reverse-geocode.ts` descobre o nome do local a partir das coordenadas, usando a API gratuita do [Nominatim (OpenStreetMap)](https://nominatim.openstreetmap.org/). Os resultados são retornados em português.

```typescript
import { reverseGeocode } from "./reverse-geocode";

const location = await reverseGeocode(-3.8527, -38.6013);
console.log(location.city);    // Maracanaú
console.log(location.state);   // Ceará
console.log(location.country); // Brasil
```

## Distância entre coordenadas (Haversine) 📏

O módulo `haversine.ts` calcula a distância entre duas coordenadas geográficas usando a [fórmula de Haversine](https://en.wikipedia.org/wiki/Haversine_formula). O resultado é retornado em metros.

```typescript
import { haversineDistance, formatDistance } from "./haversine";

// Iguatemi → RioMar Fortaleza
const distance = haversineDistance(-3.75543, -38.48734, -3.74182, -38.47023);
console.log(formatDistance(distance)); // 2.27 km
```

A função `formatDistance` formata automaticamente o valor em **cm**, **m** ou **km** conforme a grandeza.

Rode com `bun run main.ts` ou `npx tsx main.ts`
