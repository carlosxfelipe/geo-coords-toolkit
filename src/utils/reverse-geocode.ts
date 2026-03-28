interface NominatimResponse {
  display_name: string;
  address: {
    road?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    postcode?: string;
    [key: string]: string | undefined;
  };
}

export const reverseGeocode = async (
  lat: number,
  lng: number,
): Promise<{
  displayName: string;
  city: string | undefined;
  state: string | undefined;
  country: string | undefined;
}> => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=pt-BR`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "convert-to-dms/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Erro na geocodificação reversa: ${response.statusText}`);
  }

  const data: NominatimResponse = await response.json();

  return {
    displayName: data.display_name,
    city: data.address.city || data.address.town || data.address.village,
    state: data.address.state,
    country: data.address.country,
  };
};
