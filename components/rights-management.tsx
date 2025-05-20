"use client"

import { useState, useEffect } from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"

// Rights based on "VEDDeRa" from the image
const rightTypes = [
  { id: "V", label: "View" },
  { id: "E", label: "Edit" },
  { id: "D", label: "Delete" },
  { id: "De", label: "Download" },
  { id: "Ra", label: "Report Access" },
]

type Module = {
  id: number
  detail: string
}

type UserType = {
  id: number
  detail: string
}

export default function RightsManagement() {
  const [selectedUserType, setSelectedUserType] = useState("")
  const [userTypes, setUserTypes] = useState<UserType[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [rights, setRights] = useState<Record<number, string[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedUserType) {
      fetchRightsForUserType(Number.parseInt(selectedUserType))
    }
  }, [selectedUserType])

  const fetchData = async () => {
    try {
      // Load user types from localStorage or use default data
      const storedUserTypes = localStorage.getItem("userTypes")
      const userTypesData = storedUserTypes
        ? JSON.parse(storedUserTypes)
        : [
            { id: 1, detail: "Admin" },
            { id: 2, detail: "Manager" },
            { id: 3, detail: "User" },
          ]

      setUserTypes(userTypesData)

      // Load modules from localStorage or use default data
      const storedModules = localStorage.getItem("modules")
      const modulesData = storedModules
        ? JSON.parse(storedModules)
        : [
            { id: 1, detail: "Proj" },
            { id: 2, detail: "Proj-team" },
            { id: 3, detail: "Proj doc" },
            { id: 4, detail: "Proj Dis." },
          ]

      setModules(modulesData)

      // Set default selected user type
      if (userTypesData.length > 0) {
        setSelectedUserType(userTypesData[0].id.toString())
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchRightsForUserType = async (userTypeId: number) => {
    setLoading(true)
    try {
      // Load rights from localStorage or use default data
      const storedRights = localStorage.getItem(`rights_${userTypeId}`)

      if (storedRights) {
        setRights(JSON.parse(storedRights))
      } else {
        // Default rights based on user type
        const defaultRights: Record<number, string[]> = {}

        modules.forEach((module) => {
          if (userTypeId === 1) {
            // Admin
            defaultRights[module.id] = ["V", "E", "D", "De", "Ra"]
          } else if (userTypeId === 2) {
            // Manager
            if (module.id === 1) defaultRights[module.id] = ["V", "E", "De", "Ra"]
            else if (module.id === 2) defaultRights[module.id] = ["V", "E", "D", "De"]
            else if (module.id === 3) defaultRights[module.id] = ["V", "E", "De", "Ra"]
            else if (module.id === 4) defaultRights[module.id] = ["V", "E"]
          } else if (userTypeId === 3) {
            // User
            if (module.id === 1) defaultRights[module.id] = ["V"]
            else if (module.id === 2) defaultRights[module.id] = ["V"]
            else if (module.id === 3) defaultRights[module.id] = ["V", "De"]
            else if (module.id === 4) defaultRights[module.id] = ["V"]
          }
        })

        setRights(defaultRights)
        localStorage.setItem(`rights_${userTypeId}`, JSON.stringify(defaultRights))
      }
    } catch (error) {
      console.error("Error fetching rights:", error)
      toast({
        title: "Error",
        description: "Failed to load rights",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRightToggle = (moduleId: number, rightId: string) => {
    const userTypeId = Number.parseInt(selectedUserType)
    if (!userTypeId) return

    const currentRights = rights[moduleId] || []

    if (currentRights.includes(rightId)) {
      // Remove right
      const updatedRights = currentRights.filter((r) => r !== rightId)
      setRights({
        ...rights,
        [moduleId]: updatedRights,
      })
    } else {
      // Add right
      setRights({
        ...rights,
        [moduleId]: [...currentRights, rightId],
      })
    }
  }

  const handleSaveRights = async () => {
    try {
      const userTypeId = Number.parseInt(selectedUserType)
      if (!userTypeId) return

      // Save rights to localStorage
      localStorage.setItem(`rights_${userTypeId}`, JSON.stringify(rights))

      toast({
        title: "Rights saved successfully",
        description: `Updated permissions for ${userTypes.find((ut) => ut.id.toString() === selectedUserType)?.detail}`,
      })
    } catch (error) {
      console.error("Error saving rights:", error)
      toast({
        title: "Error",
        description: "Failed to save rights",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Rights Management</CardTitle>
          <CardDescription>Manage access rights for different user types</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedUserType} onValueChange={setSelectedUserType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select User Type" />
            </SelectTrigger>
            <SelectContent>
              {userTypes.map((userType) => (
                <SelectItem key={userType.id} value={userType.id.toString()}>
                  {userType.detail}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSaveRights}>
            <Save className="mr-2 h-4 w-4" />
            Save Rights
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading rights management data...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Module</TableHead>
                {rightTypes.map((right) => (
                  <TableHead key={right.id} className="text-center">
                    {right.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell className="font-medium">{module.detail}</TableCell>
                  {rightTypes.map((right) => (
                    <TableCell key={right.id} className="text-center">
                      <Checkbox
                        checked={rights[module.id] && rights[module.id].includes(right.id)}
                        onCheckedChange={() => handleRightToggle(module.id, right.id)}
                        className="mx-auto"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
