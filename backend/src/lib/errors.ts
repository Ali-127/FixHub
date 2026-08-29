import { z } from "zod";

export type ApiError = {
  status: string;
  message: string;
  errors?: Record<string, string[]>;
};

export type ApiSuccess<T> = {
  status: "ok";
  data: T;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// Helper
export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};

  error.issues.forEach((err: { path: any[]; message: string; }) => {
    const path = err.path.join(".");
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(err.message);
  });

  return formatted;
}
