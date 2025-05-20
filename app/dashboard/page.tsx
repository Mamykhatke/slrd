"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/")
      return
    }

    // Initialize database if needed
    const modules = localStorage.getItem("slrd_modules")
    if (!modules) {
      // Seed initial data
      localStorage.setItem(
        "slrd_modules",
        JSON.stringify([
          { id: 1, detail: "Proj" },
          { id: 2, detail: "Proj-team" },
          { id: 3, detail: "Proj doc" },
          { id: 4, detail: "Proj Dis." },
        ]),
      )

      localStorage.setItem(
        "slrd_user_types",
        JSON.stringify([
          { id: 1, detail: "Admin" },
          { id: 2, detail: "Manager" },
          { id: 3, detail: "User" },
        ]),
      )

      // Initialize rights data
      const defaultRights = {
        "1": {
          // Admin
          1: ["V", "E", "D", "De", "Ra"], // Proj
          2: ["V", "E", "D", "De", "Ra"], // Proj-team
          3: ["V", "E", "D", "De", "Ra"], // Proj doc
          4: ["V", "E", "D", "De", "Ra"], // Proj Dis.
        },
        "2": {
          // Manager
          1: ["V", "E", "De", "Ra"], // Proj
          2: ["V", "E", "D", "De"], // Proj-team
          3: ["V", "E", "De", "Ra"], // Proj doc
          4: ["V", "E"], // Proj Dis.
        },
        "3": {
          // User
          1: ["V"], // Proj
          2: ["V"], // Proj-team
          3: ["V", "De"], // Proj doc
          4: ["V"], // Proj Dis.
        },
      }
      localStorage.setItem("slrd_rights", JSON.stringify(defaultRights))
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
                <CardDescription>Manage system modules</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <Link href="/modules-management">
                <Button variant="link" className="px-0">
                  View Modules
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">User Types</CardTitle>
                <CardDescription>Manage user roles</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <Link href="/user-types-management">
                <Button variant="link" className="px-0">
                  View User Types
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">User Hierarchy</CardTitle>
                <CardDescription>View organizational structure</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">13</div>
              <Link href="/hierarchy">
                <Button variant="link" className="px-0">
                  View Hierarchy
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>RBAC System Overview</CardTitle>
                <CardDescription>
                  Welcome to the SLRD Project Management Role-Based Access Control System
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  This system allows you to manage user roles, permissions, and hierarchies within your organization.
                  Use the navigation links above to access different parts of the system.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Key Features</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>User hierarchy management</li>
                      <li>Role-based access control</li>
                      <li>Module management</li>
                      <li>Rights management</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Quick Links</h3>
                    <div className="space-y-2">
                      <Link href="/hierarchy">
                        <Button variant="outline" className="w-full justify-start">
                          View User Hierarchy
                        </Button>
                      </Link>
                      <Link href="/modules-management">
                        <Button variant="outline" className="w-full justify-start">
                          Manage Modules
                        </Button>
                      </Link>
                      <Link href="/user-types-management">
                        <Button variant="outline" className="w-full justify-start">
                          Manage User Types
                        </Button>
                      </Link>
                      <Link href="/rights-management">
                        <Button variant="outline" className="w-full justify-start">
                          Manage Rights
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
