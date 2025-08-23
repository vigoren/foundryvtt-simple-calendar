/**
 * Checks if a user can do an action based on a passed in permission matrix
 * @param user
 * @param permissions
 */
export function canUser(user: User | null, permissions: SimpleCalendar.PermissionMatrix): boolean {
    if (user === null) {
        return false;
    }
    return !!(
        user.isGM ||
        (permissions.player && user.hasRole(CONST.USER_ROLES.PLAYER)) ||
        (permissions.trustedPlayer && user.hasRole(CONST.USER_ROLES.TRUSTED)) ||
        (permissions.assistantGameMaster && user.hasRole(CONST.USER_ROLES.ASSISTANT)) ||
        (permissions.users && permissions.users.includes(user.id ? user.id : ""))
    );
}
