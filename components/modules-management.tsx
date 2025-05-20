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

type Module = {
  id: number
  detail: string
}

export default function ModulesManagement() {
  const [modules, setModules] = useState<Module[]>([])
  const [newModule, setNewModule] = useState({ id: 0, detail: "" })
  const [isEditing, setIsEditing] = useState(false)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchModules()
  }, [])

  const fetchModules = async () => {
    try {
      // Load from localStorage or use default data
      const storedModules = localStorage.getItem("modules")
      if (storedModules) {
        setModules(JSON.parse(storedModules))
      } else {
        // Default modules
        const defaultModules = [
          { id: 1, detail: "Proj" },
          { id: 2, detail: "Proj-team" },
          { id: 3, detail: "Proj doc" },
          { id: 4, detail: "Proj Dis." },
        ]
        setModules(defaultModules)
        localStorage.setItem("modules", JSON.stringify(defaultModules))
      }
    } catch (error) {
      console.error("Error fetching modules:", error)
      toast({
        title: "Error",
        description: "Failed to load modules",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddModule = async () => {
    try {
      if (!newModule.detail.trim()) {
        toast({
          title: "Error",
          description: "Module name cannot be empty",
          variant: "destructive",
        })
        return
      }

      if (isEditing) {
        // Update existing module
        const updatedModules = modules.map((module) => (module.id === newModule.id ? { ...newModule } : module))
        setModules(updatedModules)
        localStorage.setItem("modules", JSON.stringify(updatedModules))

        toast({
          title: "Success",
          description: "Module updated successfully",
        })
      } else {
        // Create new module
        const newId = Math.max(...modules.map((m) => m.id), 0) + 1
        const updatedModules = [...modules, { id: newId, detail: newModule.detail }]

        setModules(updatedModules)
        localStorage.setItem("modules", JSON.stringify(updatedModules))

        toast({
          title: "Success",
          description: "Module added successfully",
        })
      }

      setNewModule({ id: 0, detail: "" })
      setIsEditing(false)
      setOpen(false)
    } catch (error) {
      console.error("Error saving module:", error)
      toast({
        title: "Error",
        description: isEditing ? "Failed to update module" : "Failed to add module",
        variant: "destructive",
      })
    }
  }

  const handleEditModule = (module: Module) => {
    setNewModule({ ...module })
    setIsEditing(true)
    setOpen(true)
  }

  const handleDeleteModule = async (id: number) => {
    try {
      const updatedModules = modules.filter((module) => module.id !== id)
      setModules(updatedModules)
      localStorage.setItem("modules", JSON.stringify(updatedModules))

      toast({
        title: "Success",
        description: "Module deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting module:", error)
      toast({
        title: "Error",
        description: "Failed to delete module",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Modules Management</CardTitle>
          <CardDescription>Manage project modules in the system</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Module
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Module" : "Add New Module"}</DialogTitle>
              <DialogDescription>
                {isEditing ? "Update the module details below" : "Enter the details for the new module"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="module-id" className="text-right">
                  ID
                </Label>
                <Input
                  id="module-id"
                  value={isEditing ? newModule.id : modules.length + 1}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="module-detail" className="text-right">
                  Detail
                </Label>
                <Input
                  id="module-detail"
                  value={newModule.detail}
                  onChange={(e) => setNewModule({ ...newModule, detail: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddModule}>
                {isEditing ? "Save Changes" : "Add Module"}
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
                  Loading modules...
                </TableCell>
              </TableRow>
            ) : modules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No modules found. Add your first module.
                </TableCell>
              </TableRow>
            ) : (
              modules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell className="font-medium">{module.id}</TableCell>
                  <TableCell>{module.detail}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditModule(module)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteModule(module.id)}>
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
