// This file exports the types so other files can import from "../types"
export interface User {
  username: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}