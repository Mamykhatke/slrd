import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardHeader from "@/components/dashboard-header"
import UserRightsForm from "@/components/user-rights-form"
import { getSession } from "@/lib/auth"
import { ChevronLeft, Plus, Pencil, Users } from "lucide-react"
import { getUserById, getUsersByParentId, getModules, getRightsByUserId } from "@/lib/db"

export const metadata: Metadata = {
  title: "User Details - SLRD Project Management",
  description: "View and manage user details and subordinates",
}

export default async function UserDetailsPage({ params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  const userId = Number.parseInt(params.id)
  const user = await getUserById(userId)

  if (!user) {
    notFound()
  }

  const subordinates = await getUsersByParentId(userId)
  const modules = await getModules()
  const userRights = await getRightsByUserId(userId)

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/hierarchy">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">Level {user.level}</span>
          </div>
          <div className="flex gap-2">
            <Link href={`/hierarchy/${userId}/edit`}>
              <Button variant="outline" size="sm">
                <Pencil className="mr-2 h-4 w-4" />
                Edit User
              </Button>
            </Link>
            <Link href={`/hierarchy/${userId}/add-user`}>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Subordinate
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Details</CardTitle>
              <CardDescription>Basic information about this user</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Username</dt>
                  <dd className="mt-1">{user.username}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">User Type</dt>
                  <dd className="mt-1">{user.userType}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Position</dt>
                  <dd className="mt-1">{user.position}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Subordinates</CardTitle>
                <CardDescription>Users that report to this user</CardDescription>
              </div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {subordinates.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subordinates.map((subordinate) => (
                      <TableRow key={subordinate.id}>
                        <TableCell>{subordinate.name}</TableCell>
                        <TableCell>Level {subordinate.level}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/hierarchy/${subordinate.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-4">No subordinates found</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Rights</CardTitle>
            <CardDescription>Manage access rights for this user</CardDescription>
          </CardHeader>
          <CardContent>
            <UserRightsForm userId={userId} modules={modules} initialRights={userRights} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
