"use client";

import { getQuestions, Question } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Questions() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [questions, setQustions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const data = await getQuestions();
        setQustions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }

    if (user) fetchQuestions();
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="flex h-screen w-screen justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto p-10 gap-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">Questions</h1>
        <Link
          href="/questions/new"
          className="bg-green-200 text-black rounded-2xl px-4 py-2"
        >
          Ask a question
        </Link>
      </div>
      {isLoading && <p>Loading questions...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && questions.length === 0 && <p>No questions yet.</p>}

      <div className="flex flex-col gap-4">
        {questions.map((q) => (
          <div key={q.id} className="border border-gray-500 rounded-2xl p-4">
            <h2 className="text-lg font-semibold">{q.title}</h2>
            <p>{q.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
