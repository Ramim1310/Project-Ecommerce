/**
 * auth.js — JWT utilities for frontend session management
 */

const TOKEN_KEY = 'tp_token';
const USER_KEY  = 'tp_user';

/**
 * Decode a JWT payload without verifying signature (client-side only).
 */
function decodeToken(token) {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
}

/**
 * Returns true if the stored token exists and has not expired.
 */
export function isAuthenticated() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;

    const payload = decodeToken(token);
    if (!payload || !payload.exp) return false;

    // exp is in seconds, Date.now() is in ms
    return Date.now() < payload.exp * 1000;
}

/**
 * Save JWT token and user info to localStorage.
 */
export function saveSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Get the stored JWT token.
 */
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get the stored user object.
 */
export function getUser() {
    try {
        return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
        return null;
    }
}

/**
 * Clear session (logout).
 */
export function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}
