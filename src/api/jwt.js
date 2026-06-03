export function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function emailFromAccessToken(token) {
  const payload = decodeJwtPayload(token);
  return payload?.sub ?? null;
}
