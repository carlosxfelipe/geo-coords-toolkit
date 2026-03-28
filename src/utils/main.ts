import { formatLatLngToDMS } from "./convert-to-dms";
import { reverseGeocode } from "./reverse-geocode";
import { haversineDistance, formatDistance } from "./haversine";

// Coordenadas aproximadas da fábrica da Coca-Cola (Solar) em Maracanaú
const lat = -3.8527093961210848;
const lng = -38.60132752534783;

console.log(formatLatLngToDMS(lat, lng, { decimals: 1 }));
// 3°51'09.8"S 38°36'04.8"O

const location = await reverseGeocode(lat, lng);
console.log(`📌 Local: ${location.displayName}`);
if (location.city) console.log(`🏙️  Cidade: ${location.city}`);
if (location.state) console.log(`🗺️  Estado: ${location.state}`);
if (location.country) console.log(`🌍 País: ${location.country}`);

// Distância entre Iguatemi e RioMar Fortaleza
const distance = haversineDistance(-3.75543, -38.48734, -3.74182, -38.47023);
console.log(`📏 Distância Iguatemi → RioMar: ${formatDistance(distance)}`);
