"use client";

import React, { useState } from "react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setSuccess(false)

    try {
      if (formData.password !== formData.confirmPassword)
        throw new Error("Passwords do not match");

      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          passwordConfirm: formData.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess(true);
      console.log("User create", data);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError("Something went wrong");
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
          <label>Name</label>
          <input
            className="bg-amber-50 text-black"
            type="text"
            name="name"
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex justify-between">
          <label>Email</label>
          <input
            className="bg-amber-50 text-black"
            type="email"
            name="email"
            onChange={handleChange}
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
            required
          />
        </div>

        <div className="flex justify-between ">
          <label>Confirm password</label>
          <input
            className="bg-amber-50 text-black"
            type="password"
            name="confirmPassword"
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && (
          <p className="text-green-500">Account created successfully!</p>
        )}

        <button
          type="submit"
          className="bg-green-200 text-black rounded-2xl"
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </div>
  );
}
