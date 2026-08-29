"use client";

import { Signup as signupAPI, SignupRequest } from "@/lib/api";
import React, { useState } from "react";

const initialFormState = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

export default function SignUp() {
  const [formData, setFormData] = useState<SignupRequest>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // clear errors on type
    setFieldErrors({
      ...fieldErrors,
      [e.target.name]: [],
    });
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsLoading(true);
    setSuccess(false);

    try {
      const data = await signupAPI(formData);

      console.log("User create", data);
      setSuccess(true);
      setFormData(initialFormState);
    } catch (error) {
      console.log(error);
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
            value={formData.name}
            required
          />
          {fieldErrors.name && (
            <p className="text-red-500 text-sm">
              {fieldErrors.name.join(", ")}
            </p>
          )}
        </div>

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
          {fieldErrors.email && (
            <p className="text-red-500 text-sm">
              {fieldErrors.email.join(", ")}
            </p>
          )}
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
          {fieldErrors.password && (
            <p className="text-red-500 text-sm">
              {fieldErrors.password.join(", ")}
            </p>
          )}
        </div>

        <div className="flex justify-between ">
          <label>Confirm password</label>
          <input
            className="bg-amber-50 text-black"
            type="password"
            name="passwordConfirm"
            onChange={handleChange}
            value={formData.passwordConfirm}
            required
          />
          {fieldErrors.passwordConfirm && (
            <p className="text-red-500 text-sm">
              {fieldErrors.passwordConfirm.join(", ")}
            </p>
          )}
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
