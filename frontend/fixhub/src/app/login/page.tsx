"use client";

import React, { useState } from "react";
import { Login as LoginAPI, LoginRequest } from "@/lib/api";

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // JWT Tokens
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");

  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      const data = await LoginAPI(formData);
      console.log(data);

      setSuccess(true);
      setFormData({
        email: "",
        password: "",
      });
      // setToken(data.data.accessToken);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <form
        className="flex flex-col justify-between w-100 gap-5 "
        onSubmit={handleSubmit}
      >
        <div className="flex justify-between">
          <label>Email</label>
          <input
            className="bg-amber-50 text-black"
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            required
          />
        </div>

        <div className="flex justify-between">
          <label>Password</label>
          <input
            className="bg-amber-50 text-black"
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Logged in successfuly</p>}

        <button
          type="submit"
          className="bg-green-200 text-black rounded-2xl"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
