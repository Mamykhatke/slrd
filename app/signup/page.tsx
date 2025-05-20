"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import SignupForm from "@/components/signup-form"

export default function SignupPage() {
  const router = useRouter()
  const [userTypes, setUserTypes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user types from localStorage
    const storedUserTypes = localStorage.getItem("slrd_user_types")
    if (storedUserTypes) {
      setUserTypes(JSON.parse(storedUserTypes))
    } else {
      // Set default user types if none exist
      const defaultUserTypes = [
        { id: 1, detail: "Admin" },
        { id: 2, detail: "Manager" },
        { id: 3, detail: "User" },
      ]
      localStorage.setItem("slrd_user_types", JSON.stringify(defaultUserTypes))
      setUserTypes(defaultUserTypes)
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading signup data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="mt-2 text-gray-600">Join the SLRD Project Management system</p>
        </div>

        <SignupForm userTypes={userTypes} />

        <div className="mt-4 text-center">
          <Link href="/">
            <Button variant="link" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
