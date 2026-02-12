import axios from "axios";

// Base URL points to your .NET backend
export const api = axios.create({
  baseURL: "http://localhost:5175/api", // or "http://localhost:5175/api" if not using HTTPS
});
