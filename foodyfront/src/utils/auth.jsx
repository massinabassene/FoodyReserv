// Récupère le token JWT depuis le localStorage
export function getToken() {
  return localStorage.getItem('token');
}

// Décode le JWT pour obtenir le payload
function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Retourne le rôle de l'utilisateur connecté
export function getUserRole() {
  const token = getToken();
  const payload = parseJwt(token);
  // Selon la structure de ton JWT, adapte la clé du rôle
  return payload?.role || null;
}

// Retourne l'ID utilisateur connecté
export function getUserId() {
  const token = getToken();
  const payload = parseJwt(token);
  // Selon la structure de ton JWT, adapte la clé de l'id
  return payload?.sub || null;
}