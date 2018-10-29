import { geolocationParams } from '../constants';

const getGeolocation = (onLocationSuccess, onLocationError) => {
  navigator.geolocation.getCurrentPosition(
    onLocationSuccess,
    onLocationError,
    geolocationParams,
  );
};

export default getGeolocation;
