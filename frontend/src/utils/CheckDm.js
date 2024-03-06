export function checkDm(clientId, dmId) {
    if (clientId === dmId) {
        return true
    }
    return false
}