import { API_BASE } from '../constants';

const getHeaders = () => {
    // Prefer admin token (admin app) over customer token (customer app)
    const token = localStorage.getItem('venthulir_admin_token') || localStorage.getItem('venthulir_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

// Fetch with a timeout — prevents infinite hang on Render cold starts
const fetchWithTimeout = (url, options = {}, timeoutMs = 30000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { ...options, signal: controller.signal })
        .finally(() => clearTimeout(timeoutId));
};

export const api = {
    get: async (endpoint) => {
        const res = await fetchWithTimeout(`${API_BASE}${endpoint}`, { headers: getHeaders() });
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || errData.msg || 'API Error');
        }
        return res.json();
    },
    post: async (endpoint, data) => {
        const res = await fetchWithTimeout(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || errData.msg || 'API Error');
        }
        return res.json();
    },
    put: async (endpoint, data) => {
        const res = await fetchWithTimeout(`${API_BASE}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || errData.msg || 'API Error');
        }
        return res.json();
    },
    delete: async (endpoint) => {
        const res = await fetchWithTimeout(`${API_BASE}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || errData.msg || 'API Error');
        }
        return res.json();
    }
};
