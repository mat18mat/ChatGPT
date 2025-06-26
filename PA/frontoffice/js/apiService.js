const API_BASE_URL = "http://localhost:4000";

function getHeaders() {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

const ApiService = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Erreur GET ${endpoint}: ${message}`);
    }
    return await response.json();
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Erreur POST ${endpoint}: ${message}`);
    }
    return await response.json();
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Erreur PUT ${endpoint}: ${message}`);
    }
    return await response.json();
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Erreur DELETE ${endpoint}: ${message}`);
    }
    return await response.json();
  },
};
