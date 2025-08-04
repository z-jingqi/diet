// API基础地址
export const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : import.meta.env.DEV
    ? "http://127.0.0.1:8787/api"
    : `${window.location.origin}/api`;
