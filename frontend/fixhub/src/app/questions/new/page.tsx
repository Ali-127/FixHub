"use client";

import { createQuestion, QuestionCreate } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const initialFormState: QuestionCreate = {
  title: "",
  body: "",
};

export default function NewQuestion() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<QuestionCreate>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Check if there is a user
  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await createQuestion(formData);
      router.push("/questions");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authLoading || !user) {
    return (
      <div className="flex h-screen w-screen justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <form className="flex flex-col w-100 gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label>Title</label>
          <input
            className="bg-amber-50 text-black"
            type="text"
            name="title"
            onChange={handleChange}
            value={formData.title}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Body</label>
          <textarea
            className="bg-amber-50 text-black"
            name="body"
            onChange={handleChange}
            value={formData.body}
            rows={5}
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-green-200 text-black rounded-2xl"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post question"}
        </button>
      </form>
    </div>
  );
}
