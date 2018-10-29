import { Platform, PermissionsAndroid } from 'react-native';

export const requestPermission = async (onPermissionGranted, onPermissionReject) => {
  if (Platform.OS === 'ios') {
    return true;
  }
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      if (onPermissionGranted) {
        onPermissionGranted();
      }
      return true;
    } else {
      if (onPermissionReject) {
        onPermissionReject();
      }
      return false;
    }
    return ;
  } catch (err) {
    if (onPermissionReject) {
      onPermissionReject();
    }
    return false;
  }
}
