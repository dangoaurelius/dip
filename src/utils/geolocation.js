import { geolocationParams } from '../constants';

const getGeolocation = (onLocationSuccess, onLocationError) => {
  navigator.geolocation.getCurrentPosition(
    onLocationSuccess,
    onLocationError,
    geolocationParams,
  );
};

export default getGeolocation;

export const getInitialRegion = userPosition => ({
  ...userPosition,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
});
