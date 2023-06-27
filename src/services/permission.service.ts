import {
  PERMISSIONS,
  Permission,
  PermissionStatus,
  checkMultiple,
  requestMultiple,
} from 'react-native-permissions';
import { Platform } from 'react-native';

type PermissionType = 'CAMERA' | 'ALBUM_READ' | 'ALBUM_ADD';

export const requestPermissions = async (
  type: PermissionType
): Promise<boolean> => {
  try {
    const permissions = getPermissionType(type);
    if (!permissions) {
      throw Error('Unsupported platform');
    }

    const statuses = await checkMultiple(permissions);

    const permissionResult = (): PermissionStatus => {
      let permissionResults: PermissionStatus[] = [];
      for (const s of permissions) {
        const tmp = permissionResults;
        permissionResults = [...tmp, statuses[s]];
      }

      if (permissionResults.includes('denied')) {
        return 'denied';
      } else if (permissionResults.includes('blocked')) {
        return 'blocked';
      } else if (permissionResults.includes('unavailable')) {
        return 'unavailable';
      } else if (permissionResults.includes('limited')) {
        return 'limited';
      }
      return 'granted';
    };

    switch (permissionResult()) {
      case 'denied':
        await requestMultiple(permissions); // TODO
        return false;
      case 'granted':
      case 'limited':
        return true;
      case 'blocked':
      case 'unavailable':
      default:
        return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

const getPermissionType = (type: PermissionType): Permission[] | undefined => {
  switch (type) {
    case 'CAMERA':
      return Platform.select({
        android: [PERMISSIONS.ANDROID.CAMERA],
        ios: [PERMISSIONS.IOS.CAMERA],
      });
    case 'ALBUM_READ':
      return Platform.select({
        android: [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE],
        ios: [PERMISSIONS.IOS.PHOTO_LIBRARY],
      });
    case 'ALBUM_ADD':
      return Platform.select({
        android: [PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE],
        ios: [PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY],
      });
  }
};
