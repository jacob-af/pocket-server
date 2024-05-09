import { Permission } from '../graphql';

export function resolvePermission(
  userPermission: Permission,
  desiredPermission: Permission,
): boolean {
  function toNumber(permission: Permission) {
    switch (permission) {
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
    return false;
  } else if (toNumber(desiredPermission) - toNumber(userPermission) > 0) {
    return false;
  } else {
    return true;
  }
}
