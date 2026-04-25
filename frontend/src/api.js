const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  getUsers: () => fetch(`${API_URL}/api/users`),
  login: (data) =>
    fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
};