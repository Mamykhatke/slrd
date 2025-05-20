"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // For demo purposes, we'll use hardcoded credentials
      // In a real app, this would validate against a database
      if (password === "password123") {
        // Find the user in our predefined list
        const users = [
          {
            id: 1,
            name: "John Smith",
            username: "johnsmith",
            email: "john.smith@slrd.com",
            position: "CEO",
            level: 1,
            parentId: null,
            userTypeId: 1,
            userType: "Admin",
          },
          {
            id: 2,
            name: "Alice Johnson",
            username: "alicej",
            email: "alice.j@slrd.com",
            position: "CTO",
            level: 2,
            parentId: 1,
            userTypeId: 1,
            userType: "Admin",
          },
          {
            id: 3,
            name: "Bob Williams",
            username: "bobw",
            email: "bob.w@slrd.com",
            position: "CFO",
            level: 2,
            parentId: 1,
            userTypeId: 1,
            userType: "Admin",
          },
          {
            id: 4,
            name: "Carol Davis",
            username: "carold",
            email: "carol.d@slrd.com",
            position: "COO",
            level: 2,
            parentId: 1,
            userTypeId: 1,
            userType: "Admin",
          },
          {
            id: 5,
            name: "David Miller",
            username: "davidm",
            email: "david.m@slrd.com",
            position: "Dev Lead",
            level: 3,
            parentId: 2,
            userTypeId: 2,
            userType: "Manager",
          },
          {
            id: 6,
            name: "Emma Wilson",
            username: "emmaw",
            email: "emma.w@slrd.com",
            position: "QA Lead",
            level: 3,
            parentId: 2,
            userTypeId: 2,
            userType: "Manager",
          },
          {
            id: 7,
            name: "Frank Thomas",
            username: "frankt",
            email: "frank.t@slrd.com",
            position: "Project Manager",
            level: 3,
            parentId: 3,
            userTypeId: 2,
            userType: "Manager",
          },
          {
            id: 8,
            name: "Grace Lee",
            username: "gracel",
            email: "grace.l@slrd.com",
            position: "HR Manager",
            level: 3,
            parentId: 4,
            userTypeId: 2,
            userType: "Manager",
          },
          {
            id: 9,
            name: "Henry Brown",
            username: "henryb",
            email: "henry.b@slrd.com",
            position: "Operations Manager",
            level: 3,
            parentId: 4,
            userTypeId: 2,
            userType: "Manager",
          },
          {
            id: 10,
            name: "Ivy Chen",
            username: "ivyc",
            email: "ivy.c@slrd.com",
            position: "Developer",
            level: 4,
            parentId: 7,
            userTypeId: 3,
            userType: "User",
          },
          {
            id: 11,
            name: "Jack White",
            username: "jackw",
            email: "jack.w@slrd.com",
            position: "Developer",
            level: 4,
            parentId: 7,
            userTypeId: 3,
            userType: "User",
          },
          {
            id: 12,
            name: "Kelly Green",
            username: "kellyg",
            email: "kelly.g@slrd.com",
            position: "QA Engineer",
            level: 4,
            parentId: 7,
            userTypeId: 3,
            userType: "User",
          },
          {
            id: 13,
            name: "Laura Smith",
            username: "lauras",
            email: "laura.s@slrd.com",
            position: "Marketing Manager",
            level: 3,
            parentId: 4,
            userTypeId: 2,
            userType: "Manager",
          },
        ]

        const user = users.find((u) => u.username === username)

        if (user) {
          // Store user info in localStorage for persistence
          localStorage.setItem("user", JSON.stringify(user))

          // Also store all users for hierarchy building
          localStorage.setItem("allUsers", JSON.stringify(users))

          // Navigate to dashboard
          router.push("/dashboard")
        } else {
          setError("Invalid username or password")
        }
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-xs text-muted-foreground text-center mt-4">
            <p>Demo credentials (use with password: password123):</p>
            <p>Username: johnsmith (CEO), bobw (CFO), frankt (Project Manager)</p>
            <p>Username: alicej (CTO), carold (COO), ivyc (Developer)</p>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/signup">
          <Button variant="link" className="text-sm">
            Don't have an account? Sign up
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
