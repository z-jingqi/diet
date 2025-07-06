import React from "react";
import { useAuth } from "./AuthContext";

const TestAuthContext = () => {
  const { user, isAuthenticated, isLoading, error, login, logout, register } =
    useAuth();

  const handleLogin = async () => {
    try {
      await login("testuser", "password");
      console.log("Login successful");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleRegister = async () => {
    try {
      await register("newuser", "password");
      console.log("Register successful");
    } catch (error) {
      console.error("Register failed", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Auth Context Test</h1>

      <div className="mb-4">
        <p>Status: {isLoading ? "Loading..." : "Ready"}</p>
        <p>Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
        <p>User: {user ? user.username : "None"}</p>
        {error && <p className="text-red-500">Error: {error}</p>}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          Login
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          Logout
        </button>

        <button
          onClick={handleRegister}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default TestAuthContext;
