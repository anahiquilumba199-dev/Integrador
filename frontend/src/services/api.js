const API_URL = (import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://127.0.0.1:8000" : "/api")).replace(/\/+$/, "");

async function request(endpoint, options = {}) {
  const token = sessionStorage.getItem("ecoraee_token");
  const { headers, ...init } = options;
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const detail = error?.detail;
    const message = Array.isArray(detail)
      ? detail.map(({ loc, msg }) => `${loc.at(-1)}: ${msg}`).join(". ")
      : detail;
    if (response.status === 401 && endpoint !== "/auth/login") {
      window.dispatchEvent(new Event("ecoraee-sesion-vencida"));
    }
    throw new Error(message || `Error HTTP: ${response.status}`);
  }
  return response.status === 204 ? null : response.json();
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) => request(endpoint, {
    method: "POST", body: JSON.stringify(data)
  }),
  patch: (endpoint, data) => request(endpoint, {
    method: "PATCH", body: JSON.stringify(data)
  }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" })
};

export default api;
