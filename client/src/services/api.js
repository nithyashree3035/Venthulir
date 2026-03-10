import { API_BASE } from '../constants';

const getHeaders = () => {
    // Prefer admin token (admin app) over customer token (customer app)
    const token = localStorage.getItem('venthulir_admin_token') || localStorage.getItem('venthulir_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

export const api = {
    get: async (endpoint) => {
        const res = await fetch(`${API_BASE}${endpoint}`, { headers: getHeaders() });
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || errData.msg || 'API Error');
        }
        return res.json();
    },
    post: async (endpoint, data) => {
        const res = await fetch(`${API_BASE}${endpoint}`, {
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
        const res = await fetch(`${API_BASE}${endpoint}`, {
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
        const res = await fetch(`${API_BASE}${endpoint}`, {
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
