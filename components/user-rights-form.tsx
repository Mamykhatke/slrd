"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Save } from "lucide-react"
import { updateUserRights } from "@/lib/actions"
import type { Module, UserRight } from "@/lib/types"

// Rights based on "VEDDeRa" from the image
const rightTypes = [
  { id: "V", label: "View" },
  { id: "E", label: "Edit" },
  { id: "D", label: "Delete" },
  { id: "De", label: "Download" },
  { id: "Ra", label: "Report Access" },
]

interface UserRightsFormProps {
  userId: number
  modules: Module[]
  initialRights: UserRight[]
}

export default function UserRightsForm({ userId, modules, initialRights }: UserRightsFormProps) {
  // Transform initial rights into a more usable format
  const initialRightsMap: Record<number, string[]> = {}

  initialRights.forEach((right) => {
    if (!initialRightsMap[right.moduleId]) {
      initialRightsMap[right.moduleId] = []
    }
    initialRightsMap[right.moduleId].push(right.rightId)
  })

  const [rights, setRights] = useState<Record<number, string[]>>(initialRightsMap)
  const [isLoading, setIsLoading] = useState(false)

  const handleRightToggle = (moduleId: number, rightId: string) => {
    const currentRights = [...(rights[moduleId] || [])]

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
    setIsLoading(true)

    try {
      // Convert rights object to array format for the server action
      const rightsArray: { moduleId: number; rightId: string }[] = []

      Object.entries(rights).forEach(([moduleId, rightIds]) => {
        rightIds.forEach((rightId) => {
          rightsArray.push({
            moduleId: Number.parseInt(moduleId),
            rightId,
          })
        })
      })

      await updateUserRights(userId, rightsArray)

      toast({
        title: "Rights saved successfully",
        description: "The user's permissions have been updated",
      })
    } catch (error) {
      toast({
        title: "Failed to save rights",
        description: "An error occurred while saving the user's permissions",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
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

      <div className="flex justify-end">
        <Button onClick={handleSaveRights} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Saving..." : "Save Rights"}
        </Button>
      </div>
    </div>
  )
}
