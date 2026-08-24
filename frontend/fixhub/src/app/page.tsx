"use client";

import { getHealth } from "../lib/api";
import { useEffect, useState } from "react";

type HealthResponse = {
  status: string;
  message: string;
};

export default function Home() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHealth() {
      try {
        setIsLoading(true);
        const res = await getHealth();
        setIsLoading(false);
        setData(res);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchHealth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div>
      <h1>Health Check</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
