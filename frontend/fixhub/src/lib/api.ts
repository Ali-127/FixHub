const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Types
export type HealthResponse = {
  status: string;
  message: string;
};

export type SignupRequest = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

// Login types
export type LoginRequest = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
};

export type AuthResponse = {
  status: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
};

export type ApiErrorResponse = {
  status: "error";
  message: string;
  errors?: Record<string, string[]>;
};

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_URL}/api/health`);

  if (!res.ok) {
    throw new Error("Failed to fetch health");
  }

  return res.json();
}

export async function Signup(
  credentials: SignupRequest,
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const error: ApiErrorResponse = await res.json();
    let errorMessage = error.message || "Signup failed";
    if (error.errors) {
      const fieldErrors = Object.entries(error.errors)
        .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
        .join("; ");
      errorMessage = fieldErrors || errorMessage;

      console.log(fieldErrors);
    }
    throw new Error(errorMessage);
  }

  return res.json();
}

export async function Login(credentials: LoginRequest): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const error: ApiErrorResponse = await res.json();
    let errorMessage = error.message || "Login failed";
    if (error.errors) {
      const fieldErrors = Object.entries(error.errors)
        .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
        .join("; ");
      errorMessage = fieldErrors || errorMessage;

      console.log(fieldErrors);
    }
    throw new Error(errorMessage);
  }

  return res.json();
}
