import {
  MAP_SETTINGS,
  GOOGLE_MAPS_URL,
} from '../constants';

const getMapURL = (origin, destination) => {
  const { mode, apiKey } = MAP_SETTINGS;

  const keyParam = `key=${apiKey}`;
  const modeParam = `mode=${mode}`;

  const isOriginString = typeof origin === 'string';
  const isDestString = typeof destination === 'string';

  const originParam = isOriginString
    ? `origin=${origin}`
    : `origin=${origin.latitude},${origin.longitude}`;

  const destParam = isDestString
    ? `destination=${destination}`
    : `destination=${destination.latitude},${destination.longitude}`;

  return `${GOOGLE_MAPS_URL}?${keyParam}&${originParam}&${destParam}&${modeParam}`;
};

export default getMapURL;
