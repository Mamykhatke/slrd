"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type Module = {
  id: number
  detail: string
}

type UserType = {
  id: number
  detail: string
}

type User = {
  id: number
  name: string
  username: string
  email?: string
  position?: string
  level: number
  parentId: number | null
  userTypeId: number
  userType: string
}

export default function DatabasePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [modules, setModules] = useState<Module[]>([])
  const [userTypes, setUserTypes] = useState<UserType[]>([])
  const [rights, setRights] = useState<Record<string, Record<number, string[]>>>({})

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/")
      return
    }

    // Load data from localStorage
    const storedModules = localStorage.getItem("slrd_modules")
    if (storedModules) {
      setModules(JSON.parse(storedModules))
    }

    const storedUserTypes = localStorage.getItem("slrd_user_types")
    if (storedUserTypes) {
      setUserTypes(JSON.parse(storedUserTypes))
    }

    const storedRights = localStorage.getItem("slrd_rights")
    if (storedRights) {
      setRights(JSON.parse(storedRights))
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading database data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Database Visualization</CardTitle>
            <CardDescription>View the current state of the database tables</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="modules" className="space-y-4">
              <TabsList>
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="userTypes">User Types</TabsTrigger>
                <TabsTrigger value="rights">Rights</TabsTrigger>
              </TabsList>

              <TabsContent value="modules" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Detail</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modules.map((module) => (
                      <TableRow key={module.id}>
                        <TableCell className="font-medium">{module.id}</TableCell>
                        <TableCell>{module.detail}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="userTypes" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Detail</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userTypes.map((userType) => (
                      <TableRow key={userType.id}>
                        <TableCell className="font-medium">{userType.id}</TableCell>
                        <TableCell>{userType.detail}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="rights" className="space-y-4">
                <div className="space-y-4">
                  {Object.entries(rights).map(([userTypeId, moduleRights]) => {
                    const userType = userTypes.find((ut) => ut.id.toString() === userTypeId)
                    return (
                      <div key={userTypeId} className="border rounded-md p-4">
                        <h3 className="text-lg font-medium mb-2 flex items-center">
                          <Badge className="mr-2">{userType?.detail || `User Type ${userTypeId}`}</Badge>
                          Rights Configuration
                        </h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[200px]">Module</TableHead>
                              <TableHead>Rights</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(moduleRights).map(([moduleId, rightsList]) => {
                              const module = modules.find((m) => m.id.toString() === moduleId)
                              return (
                                <TableRow key={moduleId}>
                                  <TableCell className="font-medium">
                                    {module?.detail || `Module ${moduleId}`}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                      {rightsList.map((right) => (
                                        <Badge key={right} variant="outline">
                                          {right}
                                        </Badge>
                                      ))}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
