# 🧩 Spec - Componentes & Utils

**Referência**: [SPEC_INDEX.md](SPEC_INDEX.md) | Anterior: [SPEC_DATABASE.md](SPEC_DATABASE.md)

---

## 📋 Tipos Compartilhados

### File: `src/types/index.ts`

```typescript
// Beach Data
export interface Beach {
  id: string;
  name: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  type: 'urbana' | 'semi-urbana' | 'resort' | 'tradicional';
}

// User Location
export interface Location {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp?: number;
}

// Beach with Distance (calculated)
export interface BeachWithDistance extends Beach {
  distance: number;
  distanceFormatted: string;
}

// API Response Generic
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
  timestamp?: string;
}
```

---

## 🔧 Utils: Distance Calculation

### File: `src/utils/distance.ts`

```typescript
import { Beach, Location, BeachWithDistance } from '../types';

/**
 * Calcula distância entre dois pontos usando Haversine formula
 * @param lat1 Latitude ponto 1
 * @param lng1 Longitude ponto 1
 * @param lat2 Latitude ponto 2
 * @param lng2 Longitude ponto 2
 * @returns Distância em km
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distância em km
}

/**
 * Converte graus para radianos
 */
function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Formata distância para string legível
 * @param distanceKm Distância em km
 * @returns String formatada ex: "2.5 km"
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 0.1) {
    return '< 0.1 km';
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Filtra e ordena praias próximas
 * @param userLat Latitude do usuário
 * @param userLng Longitude do usuário
 * @param beaches Array de praias
 * @param radiusKm Raio de busca em km (padrão 10)
 * @returns Array de praias próximas ordenadas por distância
 */
export function filterNearbyBeaches(
  userLat: number,
  userLng: number,
  beaches: Beach[],
  radiusKm: number = 10
): BeachWithDistance[] {
  return beaches
    .map(beach => ({
      ...beach,
      distance: calculateDistance(userLat, userLng, beach.lat, beach.lng),
      distanceFormatted: formatDistance(
        calculateDistance(userLat, userLng, beach.lat, beach.lng)
      )
    }))
    .filter(beach => beach.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Calcula distância em metros (útil para debugging)
 */
export function calculateDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  return calculateDistance(lat1, lng1, lat2, lng2) * 1000;
}
```

---

## 🪝 Hook: Geolocation

### File: `src/hooks/useGeolocation.ts`

```typescript
import { useState, useEffect } from 'react';
import { Location } from '../types';

interface UseGeolocationReturn {
  location: Location | null;
  error: string | null;
  isLoading: boolean;
}

/**
 * Hook para monitorar localização do usuário em tempo real
 * @param onLocationChange Callback quando localização muda (opcional)
 * @returns { location, error, isLoading }
 */
export function useGeolocation(
  onLocationChange?: (location: Location) => void
): UseGeolocationReturn {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by this browser');
      setIsLoading(false);
      return;
    }

    // Inicia watchPosition
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        };
        setLocation(newLocation);
        setError(null);
        setIsLoading(false);
        
        // Callback se fornecido
        onLocationChange?.(newLocation);
      },
      (err) => {
        let errorMsg = 'Unknown error occurred';
        if (err.code === err.PERMISSION_DENIED) {
          errorMsg = 'Permission denied to access geolocation';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errorMsg = 'Position unavailable';
        } else if (err.code === err.TIMEOUT) {
          errorMsg = 'Geolocation request timeout';
        }
        setError(errorMsg);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,  // Melhor precisão (mais bateria)
        timeout: 10000,             // 10s timeout
        maximumAge: 0              // Sem cache
      }
    );

    // Cleanup
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [onLocationChange]);

  return { location, error, isLoading };
}
```

---

## 🪝 Hook: Fetch Beaches

### File: `src/hooks/useFetchBeaches.ts`

```typescript
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Beach, APIResponse } from '../types';

interface UseFetchBeachesReturn {
  beaches: Beach[];
  error: string | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

/**
 * Hook para polling de praias a cada 30s
 * @returns { beaches, error, isLoading, refetch }
 */
export function useFetchBeaches(): UseFetchBeachesReturn {
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  const fetchBeaches = async () => {
    try {
      const response = await axios.get<APIResponse<Beach[]>>(
        `${apiBaseUrl}/api/beaches`
      );
      
      if (response.data.success && response.data.data) {
        setBeaches(response.data.data);
        setError(null);
      } else {
        setError('Failed to fetch beaches');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to fetch beaches: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch inicial
    fetchBeaches();

    // Polling a cada 30s
    const interval = setInterval(() => {
      fetchBeaches();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  return { beaches, error, isLoading, refetch: fetchBeaches };
}
```

---

## 🗺️ Componente: BeachMap (Atualizado)

### File: `src/components/BeachMap.tsx`

```typescript
import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Beach, BeachWithDistance, Location } from '../types';

interface BeachMapProps {
  beaches: Beach[];
  nearbyBeaches: BeachWithDistance[];
  userLocation: Location | null;
  onSelectBeach: (beach: Beach) => void;
  selectedBeach: Beach | null;
}

export default function BeachMap({
  beaches,
  nearbyBeaches,
  userLocation,
  onSelectBeach,
  selectedBeach
}: BeachMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('Google Maps API Key missing');
      return;
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly'
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      googleMapRef.current = new google.maps.Map(mapRef.current, {
        center: userLocation 
          ? { lat: userLocation.lat, lng: userLocation.lng }
          : { lat: -12.9689, lng: -38.5182 }, // Salvador default
        zoom: 11,
        disableDefaultUI: true,
        backgroundColor: '#020617'
      });

      // Limpar marcadores antigos
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];

      // Adicionar marcadores de praias
      beaches.forEach(beach => {
        const isNearby = nearbyBeaches.some(b => b.id === beach.id);
        const isSelected = selectedBeach?.id === beach.id;
        
        const marker = new google.maps.Marker({
          position: { lat: beach.lat, lng: beach.lng },
          map: googleMapRef.current,
          title: beach.name,
          icon: isSelected
            ? 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
            : isNearby
            ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            : 'http://maps.google.com/mapfiles/ms/icons/gray-dot.png'
        });

        marker.addListener('click', () => onSelectBeach(beach));
        markersRef.current.push(marker);
      });

      // Adicionar marcador do usuário
      if (userLocation) {
        userMarkerRef.current = new google.maps.Marker({
          position: { lat: userLocation.lat, lng: userLocation.lng },
          map: googleMapRef.current,
          title: 'Você está aqui',
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });

        // Centralizar no user
        googleMapRef.current.setCenter({
          lat: userLocation.lat,
          lng: userLocation.lng
        });

        // Desenhar círculo de 10km
        if (!circleRef.current) {
          circleRef.current = new google.maps.Circle({
            map: googleMapRef.current,
            center: { lat: userLocation.lat, lng: userLocation.lng },
            radius: 10000, // 10km em metros
            fillColor: '#3b82f6',
            fillOpacity: 0.05,
            strokeColor: '#3b82f6',
            strokeOpacity: 0.3,
            strokeWeight: 1
          });
        } else {
          circleRef.current.setCenter({
            lat: userLocation.lat,
            lng: userLocation.lng
          });
        }
      }
    });

    // Cleanup
    return () => {
      markersRef.current.forEach(m => m.setMap(null));
      userMarkerRef.current?.setMap(null);
      circleRef.current?.setMap(null);
    };
  }, [beaches, nearbyBeaches, userLocation, selectedBeach, onSelectBeach]);

  return <div ref={mapRef} className="w-full h-screen bg-gray-900" />;
}
```

---

## 📍 Componente: NearbyBeaches (Novo)

### File: `src/components/NearbyBeaches.tsx`

```typescript
import { BeachWithDistance, Location } from '../types';
import { MapPin, Waves } from 'lucide-react';

interface NearbyBeachesProps {
  beaches: BeachWithDistance[];
  userLocation: Location | null;
  selectedBeach: any | null;
  onSelectBeach: (beach: any) => void;
}

export default function NearbyBeaches({
  beaches,
  userLocation,
  selectedBeach,
  onSelectBeach
}: NearbyBeachesProps) {
  if (!userLocation) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-800">
          Ativando localização... Permita acesso para ver praias próximas.
        </p>
      </div>
    );
  }

  if (beaches.length === 0) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded">
        <p className="text-sm text-gray-600">
          Nenhuma praia encontrada dentro de 10km.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold text-gray-800">
        {beaches.length} Praias Próximas
      </h3>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {beaches.map((beach, idx) => (
          <button
            key={beach.id}
            onClick={() => onSelectBeach(beach)}
            className={`w-full p-3 rounded-lg border-2 transition ${
              selectedBeach?.id === beach.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">#{idx + 1}</span>
                  <span className="font-semibold text-gray-800">
                    {beach.name}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {beach.city} • {beach.type}
                </p>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-1 text-blue-600 font-bold">
                  <MapPin size={16} />
                  {beach.distanceFormatted}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## 📦 Integração em App.tsx

### Pseudocódigo

```typescript
import { useState, useEffect, useMemo } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { useFetchBeaches } from './hooks/useFetchBeaches';
import { filterNearbyBeaches } from './utils/distance';
import BeachMap from './components/BeachMap';
import NearbyBeaches from './components/NearbyBeaches';

export default function App() {
  const [selectedBeach, setSelectedBeach] = useState(null);
  
  // Hooks
  const { location: userLocation } = useGeolocation();
  const { beaches } = useFetchBeaches();
  
  // Compute nearby beaches
  const nearbyBeaches = useMemo(() => {
    if (!userLocation) return [];
    return filterNearbyBeaches(
      userLocation.lat,
      userLocation.lng,
      beaches,
      10
    );
  }, [userLocation, beaches]);

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <BeachMap
          beaches={beaches}
          nearbyBeaches={nearbyBeaches}
          userLocation={userLocation}
          onSelectBeach={setSelectedBeach}
          selectedBeach={selectedBeach}
        />
      </div>

      <aside className="w-96 p-4 bg-white shadow-lg overflow-y-auto">
        <NearbyBeaches
          beaches={nearbyBeaches}
          userLocation={userLocation}
          selectedBeach={selectedBeach}
          onSelectBeach={setSelectedBeach}
        />
      </aside>
    </div>
  );
}
```

---

**Próximo**: [SPEC_IMPLEMENTATION.md](SPEC_IMPLEMENTATION.md)
