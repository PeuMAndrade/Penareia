import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

let optionsSet = false;
let mapsPromise: Promise<any> | null = null;
let markerPromise: Promise<any> | null = null;

function ensureOptionsSet() {
  if (optionsSet) return;

  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error('Google Maps API Key missing');
  }

  setOptions({ key: apiKey, v: 'weekly' });
  optionsSet = true;
}

export async function loadMaps() {
  ensureOptionsSet();

  if (!mapsPromise) {
    mapsPromise = importLibrary('maps');
  }

  return mapsPromise;
}

export async function loadMarkerLibrary() {
  ensureOptionsSet();

  if (!markerPromise) {
    markerPromise = importLibrary('marker');
  }

  return markerPromise;
}
