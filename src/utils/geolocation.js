import { Platform, PermissionsAndroid } from 'react-native';

import { geolocationParams } from '../constants';

let geolocationWatchID = null;

export const getCurrentGeolocation = (onLocationSuccess, onLocationError) => {
  navigator.geolocation.getCurrentPosition(
    onLocationSuccess,
    onLocationError,
    geolocationParams,
  );
};

export const subscribeGeolocation = (onLocationSuccess, onLocationError) => {
  if (geolocationWatchID) {
    unsubscribeGeolocation();
  }
  geolocationWatchID = navigator.geolocation.watchPosition(
    onLocationSuccess,
    onLocationError,
    geolocationParams,
  );
};

export const unsubscribeGeolocation = () => {
  if (geolocationWatchID) {
    navigator.geolocation.clearWatch(geolocationWatchID);
    geolocationWatchID = null;
  }
};

export const getInitialRegion = userPosition => ({
  ...userPosition,
  latitudeDelta: 0.04,
  longitudeDelta: 0.02,
});

export const checkGeolocationPermission = async () => {
  if (Platform.OS === 'ios') {
    return true;
  }
  try {
    const permissionResult = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return permissionResult === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    return false;
  }
};

export const testPointWithLocation = (point, vs) => {
  const x = point.latitude;
  const y = point.longitude;

  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i].latitude;
    const yi = vs[i].longitude;
    const xj = vs[j].latitude;
    const yj = vs[j].longitude;
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};
