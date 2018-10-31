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

export const testPointWithLocation = (point, polygon) => {
  let testResult = false;
  const lastElementIndex = polygon.length - 1;

  polygon.forEach((polyPoint) => {
    if (((polyPoint.latitude <= point.latitude && point.latitude < polygon[lastElementIndex].latitude)
       || ((polygon[lastElementIndex].latitude <= point.latitude) && (point.latitude < polyPoint.latitude)))
       && (point.longitude < (polygon[lastElementIndex].longitude - polyPoint.longitude) * (point.latitude - polyPoint.latitude) / polygon[lastElementIndex].latitude - polyPoint.latitude + polyPoint.longitude)
    ) {
      //
      testResult = true;
    }
  });

  return testResult;
};
