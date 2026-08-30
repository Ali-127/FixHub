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

const fetchOptions = {
  credentials: "include" as const,
};

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_URL}/api/health`, fetchOptions);

  if (!res.ok) {
    throw new Error("Failed to fetch health");
  }

  return res.json();
}

export async function Signup(
  credentials: SignupRequest,
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    ...fetchOptions,
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
    ...fetchOptions,
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

export async function getDashboard(): Promise<{
  message: string;
  userId: string;
}> {
  const res = await fetch(`${API_URL}/api/user/dashboard`, fetchOptions);

  if (!res.ok) {
    const error: ApiErrorResponse = await res.json();
    throw new Error(error.message || "Failed to access dashbaord");
  }

  const data = await res.json();
  return data.data;
}

export async function getMe(): Promise<{
  status: string;
  data: { user: User };
}> {
  let res = await fetch(`${API_URL}/api/auth/me`, fetchOptions);

  if (!res.ok) {
    await fetch(`${API_URL}/api/auth/refresh`, {
      ...fetchOptions,
      method: "POST",
    });
    res = await await fetch(`${API_URL}/api/auth/me`, fetchOptions);
  }

  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
}
