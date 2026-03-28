type CoordType = "lat" | "lon";

export const convertToDMS = (
  coord: number,
  type: CoordType,
  options?: { decimals?: number; pad?: boolean },
) => {
  const { decimals = 2, pad = true } = options || {};

  const absolute = Math.abs(coord);
  let degrees = Math.floor(absolute);

  const minutesFloat = (absolute - degrees) * 60;
  let minutes = Math.floor(minutesFloat);

  let seconds = (minutesFloat - minutes) * 60;

  // Arredondamento correto com base nas casas decimais
  const factor = Math.pow(10, decimals);
  seconds = Math.round(seconds * factor) / factor;

  // Trata overflow de segundos e minutos após arredondamento
  if (seconds >= 60) {
    seconds = 0;
    minutes += 1;
  }
  if (minutes >= 60) {
    minutes = 0;
    degrees += 1;
  }

  const direction =
    type === "lat" ? (coord >= 0 ? "N" : "S") : coord >= 0 ? "L" : "O";

  // Formata os segundos separando a parte inteira para o padding
  const secondsFixed = seconds.toFixed(decimals);
  const [intPart, decPart] = secondsFixed.split(".");

  const paddedMinutes = pad
    ? String(minutes).padStart(2, "0")
    : String(minutes);
  const paddedSecondsInt = pad ? intPart.padStart(2, "0") : intPart;

  const secondsStr = decPart
    ? `${paddedSecondsInt}.${decPart}`
    : paddedSecondsInt;

  return `${degrees}°${paddedMinutes}'${secondsStr}"${direction}`;
};

export const formatLatLngToDMS = (
  lat: number,
  lng: number,
  options?: { decimals?: number; pad?: boolean },
) => {
  return `${convertToDMS(lat, "lat", options)} ${convertToDMS(lng, "lon", options)}`;
};
