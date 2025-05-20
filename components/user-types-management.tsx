"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

type UserType = {
  id: number
  detail: string
}

export default function UserTypesManagement() {
  const [userTypes, setUserTypes] = useState<UserType[]>([])
  const [newUserType, setNewUserType] = useState({ id: 0, detail: "" })
  const [isEditing, setIsEditing] = useState(false)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserTypes()
  }, [])

  const fetchUserTypes = async () => {
    try {
      // Load from localStorage or use default data
      const storedUserTypes = localStorage.getItem("userTypes")
      if (storedUserTypes) {
        setUserTypes(JSON.parse(storedUserTypes))
      } else {
        // Default user types
        const defaultUserTypes = [
          { id: 1, detail: "Admin" },
          { id: 2, detail: "Manager" },
          { id: 3, detail: "User" },
        ]
        setUserTypes(defaultUserTypes)
        localStorage.setItem("userTypes", JSON.stringify(defaultUserTypes))
      }
    } catch (error) {
      console.error("Error fetching user types:", error)
      toast({
        title: "Error",
        description: "Failed to load user types",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddUserType = async () => {
    try {
      if (!newUserType.detail.trim()) {
        toast({
          title: "Error",
          description: "User type name cannot be empty",
          variant: "destructive",
        })
        return
      }

      if (isEditing) {
        // Update existing user type
        const updatedUserTypes = userTypes.map((userType) =>
          userType.id === newUserType.id ? { ...newUserType } : userType,
        )
        setUserTypes(updatedUserTypes)
        localStorage.setItem("userTypes", JSON.stringify(updatedUserTypes))

        toast({
          title: "Success",
          description: "User type updated successfully",
        })
      } else {
        // Create new user type
        const newId = Math.max(...userTypes.map((ut) => ut.id), 0) + 1
        const updatedUserTypes = [...userTypes, { id: newId, detail: newUserType.detail }]

        setUserTypes(updatedUserTypes)
        localStorage.setItem("userTypes", JSON.stringify(updatedUserTypes))

        toast({
          title: "Success",
          description: "User type added successfully",
        })
      }

      setNewUserType({ id: 0, detail: "" })
      setIsEditing(false)
      setOpen(false)
    } catch (error) {
      console.error("Error saving user type:", error)
      toast({
        title: "Error",
        description: isEditing ? "Failed to update user type" : "Failed to add user type",
        variant: "destructive",
      })
    }
  }

  const handleEditUserType = (userType: UserType) => {
    setNewUserType({ ...userType })
    setIsEditing(true)
    setOpen(true)
  }

  const handleDeleteUserType = async (id: number) => {
    try {
      const updatedUserTypes = userTypes.filter((userType) => userType.id !== id)
      setUserTypes(updatedUserTypes)
      localStorage.setItem("userTypes", JSON.stringify(updatedUserTypes))

      toast({
        title: "Success",
        description: "User type deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting user type:", error)
      toast({
        title: "Error",
        description: "Failed to delete user type",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>User Types Management</CardTitle>
          <CardDescription>Manage user types and roles in the system</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add User Type
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit User Type" : "Add New User Type"}</DialogTitle>
              <DialogDescription>
                {isEditing ? "Update the user type details below" : "Enter the details for the new user type"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="usertype-id" className="text-right">
                  ID
                </Label>
                <Input
                  id="usertype-id"
                  value={isEditing ? newUserType.id : userTypes.length + 1}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="usertype-detail" className="text-right">
                  Detail
                </Label>
                <Input
                  id="usertype-detail"
                  value={newUserType.detail}
                  onChange={(e) => setNewUserType({ ...newUserType, detail: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddUserType}>
                {isEditing ? "Save Changes" : "Add User Type"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Detail</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  Loading user types...
                </TableCell>
              </TableRow>
            ) : userTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No user types found. Add your first user type.
                </TableCell>
              </TableRow>
            ) : (
              userTypes.map((userType) => (
                <TableRow key={userType.id}>
                  <TableCell className="font-medium">{userType.id}</TableCell>
                  <TableCell>{userType.detail}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditUserType(userType)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteUserType(userType.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
