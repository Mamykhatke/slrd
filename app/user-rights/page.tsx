import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "User Rights - SLRD Project Management",
  description: "View and manage user rights for SLRD Project Management",
}

// Dummy data
const userRights = [
  {
    id: 1,
    userType: "Admin",
    module: "Proj",
    rights: ["View", "Edit", "Delete", "Download", "Report Access"],
  },
  {
    id: 2,
    userType: "Admin",
    module: "Proj-team",
    rights: ["View", "Edit", "Delete", "Download", "Report Access"],
  },
  {
    id: 3,
    userType: "Manager",
    module: "Proj",
    rights: ["View", "Edit", "Download", "Report Access"],
  },
  {
    id: 4,
    userType: "Manager",
    module: "Proj-team",
    rights: ["View", "Edit", "Delete", "Download"],
  },
  {
    id: 5,
    userType: "User",
    module: "Proj",
    rights: ["View"],
  },
  {
    id: 6,
    userType: "User",
    module: "Proj doc",
    rights: ["View", "Download"],
  },
]

export default function UserRightsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Rights</h1>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by User Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All User Types</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="proj">Proj</SelectItem>
                <SelectItem value="proj-team">Proj-team</SelectItem>
                <SelectItem value="proj-doc">Proj doc</SelectItem>
                <SelectItem value="proj-dis">Proj Dis.</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Rights Overview</CardTitle>
            <CardDescription>View all user rights across different modules and user types</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User Type</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Rights</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userRights.map((right) => (
                  <TableRow key={right.id}>
                    <TableCell>{right.id}</TableCell>
                    <TableCell>{right.userType}</TableCell>
                    <TableCell>{right.module}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {right.rights.map((r) => (
                          <Badge key={r} variant="outline">
                            {r}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
