// API base URL - reads from environment variable for production deployment
// In development: defaults to localhost
// In production: set VITE_API_URL environment variable to your backend domain
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5285';

export default API_URL;
