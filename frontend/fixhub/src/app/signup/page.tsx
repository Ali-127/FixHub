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

        <div className="flex justify-between ">
          <label>Confirm password</label>
          <input
            className="bg-amber-50 text-black"
            type="password"
            name="confirmPassword"
            onChange={handleChange}
            value={formData.passwordConfirm}
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
