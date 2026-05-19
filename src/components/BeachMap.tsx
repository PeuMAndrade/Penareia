import { useEffect, useRef } from 'react';
import { loadMaps, loadMarkerLibrary } from '../lib/googleMaps';

interface Beach {
  id: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
}

interface Location {
  lat: number;
  lng: number;
  accuracy: number;
}

interface BeachMapProps {
  beaches: Beach[];
  onSelectBeach: (beach: Beach) => void;
  selectedBeach: Beach | null;
  userLocation: Location | null;
}

type MarkerLike = {
  addListener: (eventName: string, handler: () => void) => void;
  setMap?: (map: any) => void;
  map?: any;
};

type AdvancedMarkerLike = {
  addEventListener: (eventName: string, handler: () => void) => void;
};

type LegacyMarkerLike = {
  addListener: (eventName: string, handler: () => void) => void;
  setMap: (map: any) => void;
};

export default function BeachMap({ beaches, onSelectBeach, selectedBeach, userLocation }: BeachMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<Array<MarkerLike | AdvancedMarkerLike | LegacyMarkerLike>>([]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const maps = await loadMaps();
        const markerLib = await loadMarkerLibrary();

        if (!mounted || !mapRef.current) return;

        const gmaps = (globalThis as any).google?.maps || (maps as any);
        if (!gmaps?.Map) {
          throw new Error('google.maps.Map is not available');
        }

        const mapId = ((import.meta.env as any).VITE_GOOGLE_MAPS_MAP_ID || '').trim();
        const useAdvancedMarkers = Boolean(mapId);

        if (useAdvancedMarkers) {
          await loadMarkerLibrary();
        }

        googleMapRef.current = new gmaps.Map(mapRef.current, {
          center: userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : { lat: -25.0, lng: -45.0 },
          zoom: userLocation ? 13 : 5,
          styles: mapStyle,
          disableDefaultUI: true,
          backgroundColor: '#020617',
          mapId: mapId || undefined,
        });

        markersRef.current.forEach((marker: MarkerLike) => {
          if (marker.setMap) {
            marker.setMap(null);
          } else if ('map' in marker) {
            marker.map = null;
          }
        });
        markersRef.current = [];

        beaches.forEach(beach => {
          const position = { lat: beach.lat, lng: beach.lng };
          if (useAdvancedMarkers && markerLib?.AdvancedMarkerElement) {
            const pinElement = markerLib.PinElement
              ? new markerLib.PinElement({
                  background: '#3b82f6',
                  borderColor: '#ffffff',
                  glyphColor: '#ffffff',
                })
              : null;

            const marker = new markerLib.AdvancedMarkerElement({
              map: googleMapRef.current,
              position,
              title: beach.name,
              content: pinElement || undefined,
            }) as AdvancedMarkerLike;

            marker.addEventListener('gmp-click', () => {
              onSelectBeach(beach);
            });

            markersRef.current.push(marker);
            return;
          }

          const marker = new gmaps.Marker({
            map: googleMapRef.current,
            position,
            title: beach.name,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          }) as LegacyMarkerLike;

          marker.addListener('click', () => {
            onSelectBeach(beach);
          });

          markersRef.current.push(marker);
        });
      } catch (err) {
        console.error('Error loading Google Maps', err);
      }
    })();

    return () => {
      mounted = false;
      markersRef.current.forEach((marker: MarkerLike) => {
        if (marker.setMap) {
          marker.setMap(null);
          return;
        }

        if ('map' in marker) {
          marker.map = null;
        }
      });
      markersRef.current = [];
      googleMapRef.current = null;
    };
  }, [beaches, userLocation, onSelectBeach]);

  useEffect(() => {
    if (selectedBeach && googleMapRef.current) {
      googleMapRef.current.panTo({ lat: selectedBeach.lat, lng: selectedBeach.lng });
      googleMapRef.current.setZoom(13);
    }
  }, [selectedBeach]);

  useEffect(() => {
    if (userLocation && googleMapRef.current) {
      googleMapRef.current.panTo({ lat: userLocation.lat, lng: userLocation.lng });
      googleMapRef.current.setZoom(13);
    }
  }, [userLocation]);

  return <div ref={mapRef} className="w-full h-full" />;
}

const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#f8fafc' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.government', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.medical', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.place_of_worship', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.school', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.sports_complex', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#e2e8f0' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { featureType: 'road', elementType: 'labels.text.stroke', stylers: [{ color: '#f8fafc' }] },
  { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { featureType: 'administrative', elementType: 'labels.text.stroke', stylers: [{ color: '#f8fafc' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e0f2fe' }] },
];
