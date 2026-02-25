// Fallback to origin for monorepo deployments or local dev
const isProduction = import.meta.env.PROD;
const envUrl = import.meta.env.VITE_API_URL;

export const API_BASE_URL = envUrl || (isProduction ? window.location.origin : 'http://localhost:3000');
