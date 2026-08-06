// API helper for the admin dashboard. Targets Next.js API routes under /api/*.

const buildUrl = (path, params = {}) => {
  const url = new URL(path, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
};

const request = async (path, options = {}, params = {}) => {
  const response = await fetch(buildUrl(path, params), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed');
  }

  return data;
};

const detail = (resource) => (id) => `/api/${resource}/${id}`;

export const apiGet = (resource) => request(`/api/${resource}`, { method: 'GET' });
export const apiPost = (resource, body) =>
  request(`/api/${resource}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
export const apiPut = (resource, id, body) =>
  request(detail(resource)(id), {
    method: 'PUT',
    body: JSON.stringify(body),
  });
export const apiDelete = (resource, id) =>
  request(detail(resource)(id), { method: 'DELETE' });

// Profile is a singleton — no [id] suffix.
export const getProfile = () => request('/api/profile', { method: 'GET' });
export const updateProfile = (body) =>
  request('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(body),
  });

// Auth helpers (login / logout / me).
export const authLogin = (username, password) =>
  request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
export const authLogout = () =>
  request('/api/auth/logout', { method: 'POST' });
export const authMe = () => request('/api/auth/me', { method: 'GET' });

// Media upload — sends a file to /api/upload as multipart/form-data.
// Returns { url, key, contentType, size, originalName } on success.
export async function uploadMedia(file, folder) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
    // Note: NO Content-Type header — the browser sets it with the boundary
    // for multipart/form-data when we use FormData. Setting it manually
    // would break the boundary and cause a 400.
    credentials: 'include',
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || `Upload failed (${response.status})`);
  }

  return data;
}