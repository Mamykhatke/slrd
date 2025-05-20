import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard-header"
import AddUserForm from "@/components/add-user-form"
import { getSession } from "@/lib/auth"
import { ChevronLeft } from "lucide-react"
import { getUserById, getUserTypes } from "@/lib/db"

export const metadata: Metadata = {
  title: "Add Subordinate - SLRD Project Management",
  description: "Add a new subordinate user to the hierarchy",
}

export default async function AddUserPage({ params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  const parentId = Number.parseInt(params.id)
  const parent = await getUserById(parentId)

  if (!parent) {
    notFound()
  }

  const userTypes = await getUserTypes()

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-2">
          <Link href={`/hierarchy/${parentId}`}>
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Add Subordinate</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
            <CardDescription>
              Create a new user that will report to {parent.name} (Level {parent.level})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddUserForm parentId={parentId} parentLevel={parent.level} userTypes={userTypes} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
