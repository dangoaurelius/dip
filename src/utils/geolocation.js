import { geolocationParams } from '../constants';

export default getGeolocation = (onLocationSuccess, onLocationError) => {
  navigator.geolocation.getCurrentPosition(
    onLocationSuccess,
    onLocationError,
    geolocationParams,
  );
}
