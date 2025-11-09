// src/services/api.js
const API_URL = 'http://localhost:3000/api';

const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

export const authAPI = {
  login: async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return response.json();
  }
};

export const equipmentAPI = {
  getAll: async (token, searchTerm = '') => {
    const response = await fetch(`${API_URL}/equipment?search=${searchTerm}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  getMy: async (token) => {
    const response = await fetch(`${API_URL}/requests/my`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  create: async (token, requestData) => {
    const response = await fetch(`${API_URL}/requests`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(requestData)
    });
    return response.json();
  },

  approveReject: async (token, requestId, action) => {
    const response = await fetch(`${API_URL}/requests/${requestId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ action })
    });
    return response.json();
  },

  markReturned: async (token, requestId) => {
    const response = await fetch(`${API_URL}/requests/${requestId}/return`, {
      method: 'PUT',
      headers: getAuthHeaders(token)
    });
    return response.json();
  },

  add: async (token, equipmentData) => {
    const response = await fetch(`${API_URL}/equipment`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(equipmentData)
    });
    return response.json();
  },

  update: async (token, id, equipmentData) => {
    const response = await fetch(`${API_URL}/equipment/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(equipmentData)
    });
    return response.json();
  }
};

export const requestsAPI = {

    getAll: async (token) => {
    const response = await fetch(`${API_URL}/requests`, {
      method: 'GET',
      headers: getAuthHeaders(token)
    });
    return response.json();
  },

  getMy: async (token) => {
    const response = await fetch(`${API_URL}/requests/my`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  create: async (token, requestData) => {
    const response = await fetch(`${API_URL}/requests`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(requestData)
    });
    return response.json();
  },

  approveReject: async (token, requestId, action) => {
    const response = await fetch(`${API_URL}/requests/${requestId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ action })
    });
    return response.json();
  },

  markReturned: async (token, requestId) => {
    const response = await fetch(`${API_URL}/requests/${requestId}/return`, {
      method: 'PUT',
      headers: getAuthHeaders(token)
    });
    return response.json();
  },
}