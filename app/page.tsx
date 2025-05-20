"use client"
import LoginForm from "@/components/login-form"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">SLRD Project Management</h1>
          <p className="mt-2 text-gray-600">Sign in to access the role-based management system</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
