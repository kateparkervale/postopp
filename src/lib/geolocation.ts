interface LocationResult {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
}

export async function getCurrentLocation(): Promise<LocationResult> {
  if (!("geolocation" in navigator)) {
    return { latitude: null, longitude: null, accuracy: null };
  }

  try {
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 60000,
        });
      }
    );
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
    };
  } catch {
    return { latitude: null, longitude: null, accuracy: null };
  }
}
