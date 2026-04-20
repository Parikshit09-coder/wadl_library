const API_BASE_URL = '/api';

export async function apiFetch(path, options = {}) {
  const init = {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  };

  const response = await fetch(`${API_BASE_URL}${path}`, init);
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || response.statusText || 'API request failed');
  }

  return data;
}

export function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
