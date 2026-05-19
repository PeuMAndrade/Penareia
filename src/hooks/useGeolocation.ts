import { useEffect, useState } from 'react';

interface Location {
  lat: number;
  lng: number;
  accuracy: number;
}

interface UseGeolocationReturn {
  location: Location | null;
  error: string | null;
  isLoading: boolean;
}

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation não suportado neste navegador');
      setIsLoading(false);
      return;
    }

    // Inicia monitoramento contínuo (atualiza a cada ~10s)
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setError(null);
        setIsLoading(false);
      },
      (err) => {
        let message = 'Erro ao obter localização';
        if (err.code === err.PERMISSION_DENIED) {
          message = 'Permissão de geolocalização negada';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          message = 'Localização não disponível';
        } else if (err.code === err.TIMEOUT) {
          message = 'Timeout ao obter localização';
        }
        setError(message);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    // Cleanup: para o watch ao desmontar
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { location, error, isLoading };
}
