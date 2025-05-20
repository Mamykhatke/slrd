import { cookies } from "next/headers"
import { getUserByUsername } from "./db"
import type { Session } from "./types"

// In a real app, you would use a proper session management system
// This is a simplified version for demonstration purposes

export async function createSession(
  userId: number,
  username: string,
  name: string,
  userType: string,
  level: number,
): Promise<void> {
  const session: Session = {
    id: Date.now(),
    userId,
    username,
    name,
    userType,
    level,
  }

  // Store session in a cookie
  cookies().set({
    name: "session",
    value: JSON.stringify(session),
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  })
}

export async function getSession(): Promise<Session | null> {
  const sessionCookie = cookies().get("session")

  if (!sessionCookie) {
    return null
  }

  try {
    return JSON.parse(sessionCookie.value) as Session
  } catch {
    return null
  }
}

export async function clearSession(): Promise<void> {
  cookies().delete("session")
}

export async function authenticateUser(username: string, password: string): Promise<Session | null> {
  const user = await getUserByUsername(username)

  if (!user || user.password !== password) {
    return null
  }

  await createSession(user.id, user.username, user.name, user.userType, user.level)

  return {
    id: Date.now(),
    userId: user.id,
    username: user.username,
    name: user.name,
    userType: user.userType,
    level: user.level,
  }
}
