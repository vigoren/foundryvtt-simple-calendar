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
        (permissions.player && user.hasRole(1)) ||
        (permissions.trustedPlayer && user.hasRole(2)) ||
        (permissions.assistantGameMaster && user.hasRole(3)) ||
        (permissions.users && permissions.users.includes(user.id ? user.id : ""))
    );
}
