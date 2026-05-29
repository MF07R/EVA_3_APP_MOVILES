import * as Location from 'expo-location';
import { useState } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Se necesita acceso a la ubicación');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    } catch {
      setError('No se pudo obtener la ubicación');
    } finally {
      setLoading(false);
    }
  };

  const clearLocation = () => setLocation(null);

  return { location, setLocation, loading, error, getCurrentLocation, clearLocation };
}