import { Permission } from '../graphql';

export function resolvePermission(
  userPermission: Permission,
  desiredPermission: Permission,
): boolean {
  function toNumber(permission) {
    switch (permission) {
      case 'ADMIN':
        return 4;
      case 'OWNER':
        return 3;
      case 'MANAGER':
        return 2;
      case 'VIEW':
        return 1;
      default:
        return 0;
    }
  }
  console.log(userPermission, desiredPermission);
  if (toNumber(userPermission) < 2) {
    console.log(userPermission);
    console.log(toNumber(userPermission));
    return false;
  } else if (toNumber(desiredPermission) - toNumber(userPermission) > 0) {
    return false;
  } else {
    return true;
  }
}
