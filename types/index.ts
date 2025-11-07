export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface Product {
  id: number;
  name: string;
  type: string;
}

export interface OnboardingRequest {
  nombre: string;
  documento: string;
  email: string;
  montoInicial: number;
}

export interface OnboardingResponse {
  onboardingId: string;
  status: string;
}

export interface RegisteredClient {
  id: string; // onboardingId
  nombre: string;
  documento: string;
  email: string;
  montoInicial: number;
  status: string;
  registeredAt: string; // ISO date string
}

export interface HealthResponse {
  ok: boolean;
}

export interface DecodedToken {
  exp: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
}

