const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function getHealth() {
  const res = await fetch(`${API_URL}/api/health`)

  if (!res.ok) {
    throw new Error('Failed to fetch health')
  }

  return res.json()
}
