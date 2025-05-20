"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronRight, User, Info, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

type UserType = {
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

type HierarchyNode = UserType & {
  children: HierarchyNode[]
  expanded?: boolean
}

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

export default function UserHierarchyView() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [hierarchyData, setHierarchyData] = useState<HierarchyNode | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [viewMode, setViewMode] = useState<"tree" | "list">("tree")
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [userDetailsOpen, setUserDetailsOpen] = useState(false)
  const [userRightsOpen, setUserRightsOpen] = useState(false)
  const [modules, setModules] = useState<Module[]>([])
  const [userTypes, setUserTypes] = useState<{ id: number; detail: string }[]>([])
  const [selectedUserType, setSelectedUserType] = useState("")
  const [userRights, setUserRights] = useState<Record<number, string[]>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user from localStorage
        const storedUser = localStorage.getItem("user")
        if (!storedUser) {
          throw new Error("User not found")
        }

        const user = JSON.parse(storedUser)
        setCurrentUser(user)

        // Get all users from localStorage
        const storedAllUsers = localStorage.getItem("allUsers")
        if (!storedAllUsers) {
          throw new Error("User data not found")
        }

        const allUsers = JSON.parse(storedAllUsers)

        // Build hierarchy tree starting from the current user
        const hierarchyTree = buildHierarchyTree(allUsers, user.id)
        setHierarchyData(hierarchyTree)

        // Load modules
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

        // Load user types
        const storedUserTypes = localStorage.getItem("userTypes")
        if (storedUserTypes) {
          setUserTypes(JSON.parse(storedUserTypes))
        } else {
          // Default user types
          const defaultUserTypes = [
            { id: 1, detail: "Admin" },
            { id: 2, detail: "Manager" },
            { id: 3, detail: "User" },
            { id: 4, detail: "manager4" },
          ]
          setUserTypes(defaultUserTypes)
          localStorage.setItem("userTypes", JSON.stringify(defaultUserTypes))
        }
      } catch (err: any) {
        setError(err.message || "Failed to load hierarchy data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Build hierarchy tree starting from the current user
  const buildHierarchyTree = (users: UserType[], rootId: number): HierarchyNode | null => {
    const rootUser = users.find((u) => u.id === rootId)
    if (!rootUser) return null

    const buildNode = (user: UserType): HierarchyNode => {
      const children = users.filter((u) => u.parentId === user.id).map(buildNode)

      return {
        ...user,
        children,
        expanded: true,
      }
    }

    return buildNode(rootUser)
  }

  // Toggle expand/collapse of a node
  const toggleNode = (node: HierarchyNode) => {
    const toggleNodeRecursive = (currentNode: HierarchyNode): HierarchyNode => {
      if (currentNode.id === node.id) {
        return { ...currentNode, expanded: !currentNode.expanded }
      }

      if (currentNode.children.length > 0) {
        return {
          ...currentNode,
          children: currentNode.children.map(toggleNodeRecursive),
        }
      }

      return currentNode
    }

    if (hierarchyData) {
      setHierarchyData(toggleNodeRecursive(hierarchyData))
    }
  }

  // Show user details
  const showUserDetails = (user: UserType) => {
    setSelectedUser(user)
    setUserDetailsOpen(true)
  }

  // Show user rights management
  const showUserRights = (user: UserType) => {
    setSelectedUser(user)
    setSelectedUserType(user.userTypeId.toString())

    // Load user-specific rights if they exist
    const userSpecificRights = localStorage.getItem(`user_rights_${user.id}`)
    if (userSpecificRights) {
      setUserRights(JSON.parse(userSpecificRights))
    } else {
      // Load default rights for the user type
      const userTypeRights = localStorage.getItem(`rights_${user.userTypeId}`)
      if (userTypeRights) {
        setUserRights(JSON.parse(userTypeRights))
      } else {
        // Set default rights based on user type
        const defaultRights: Record<number, string[]> = {}

        modules.forEach((module) => {
          if (user.userTypeId === 1) {
            // Admin
            defaultRights[module.id] = ["V", "E", "D", "De", "Ra"]
          } else if (user.userTypeId === 2) {
            // Manager
            if (module.id === 1) defaultRights[module.id] = ["V", "E", "De", "Ra"]
            else if (module.id === 2) defaultRights[module.id] = ["V", "E", "D", "De"]
            else if (module.id === 3) defaultRights[module.id] = ["V", "E", "De", "Ra"]
            else if (module.id === 4) defaultRights[module.id] = ["V", "E"]
          } else if (user.userTypeId === 3) {
            // User
            if (module.id === 1) defaultRights[module.id] = ["V"]
            else if (module.id === 2) defaultRights[module.id] = ["V"]
            else if (module.id === 3) defaultRights[module.id] = ["V", "De"]
            else if (module.id === 4) defaultRights[module.id] = ["V"]
          } else {
            // Default for other user types
            defaultRights[module.id] = ["V"]
          }
        })

        setUserRights(defaultRights)
      }
    }

    setUserRightsOpen(true)
  }

  // Handle user type change in rights management
  const handleUserTypeChange = (value: string) => {
    setSelectedUserType(value)

    if (!selectedUser) return

    // Load rights for the selected user type
    const userTypeRights = localStorage.getItem(`rights_${value}`)
    if (userTypeRights) {
      setUserRights(JSON.parse(userTypeRights))
    } else {
      // Set default rights based on user type
      const defaultRights: Record<number, string[]> = {}
      const userTypeId = Number.parseInt(value)

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
        } else {
          // Default for other user types
          defaultRights[module.id] = ["V"]
        }
      })

      setUserRights(defaultRights)
    }
  }

  // Handle right toggle in rights management
  const handleRightToggle = (moduleId: number, rightId: string) => {
    const currentRights = userRights[moduleId] || []

    if (currentRights.includes(rightId)) {
      // Remove right
      const updatedRights = currentRights.filter((r) => r !== rightId)
      setUserRights({
        ...userRights,
        [moduleId]: updatedRights,
      })
    } else {
      // Add right
      setUserRights({
        ...userRights,
        [moduleId]: [...currentRights, rightId],
      })
    }
  }

  // Save user rights
  const saveUserRights = () => {
    if (!selectedUser) return

    // Save user-specific rights
    localStorage.setItem(`user_rights_${selectedUser.id}`, JSON.stringify(userRights))

    // Update user type if changed
    if (selectedUser.userTypeId.toString() !== selectedUserType) {
      // Get all users
      const storedAllUsers = localStorage.getItem("allUsers")
      if (storedAllUsers) {
        const allUsers = JSON.parse(storedAllUsers)

        // Update the user's user type
        const updatedUsers = allUsers.map((user: UserType) => {
          if (user.id === selectedUser.id) {
            const userType = userTypes.find((ut) => ut.id.toString() === selectedUserType)
            return {
              ...user,
              userTypeId: Number.parseInt(selectedUserType),
              userType: userType ? userType.detail : user.userType,
            }
          }
          return user
        })

        // Save updated users
        localStorage.setItem("allUsers", JSON.stringify(updatedUsers))

        // Update hierarchy data
        const updatedHierarchy = buildHierarchyTree(updatedUsers, currentUser?.id || 0)
        setHierarchyData(updatedHierarchy)

        // Update selected user
        const updatedUser = updatedUsers.find((user: UserType) => user.id === selectedUser.id)
        if (updatedUser) {
          setSelectedUser(updatedUser)
        }
      }
    }

    toast({
      title: "Rights saved successfully",
      description: `Updated permissions for ${selectedUser.name}`,
    })
  }

  // Render a single node in the hierarchy tree
  const renderNode = (node: HierarchyNode, level = 0) => {
    return (
      <div key={node.id} className="mb-1">
        <div
          className="flex items-center py-1 px-2 rounded-md hover:bg-muted/50 cursor-pointer"
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          <div className="flex-1 flex items-center">
            <Button variant="ghost" size="sm" className="p-0 h-6 w-6 mr-1" onClick={() => toggleNode(node)}>
              {node.children.length > 0 ? (
                node.expanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )
              ) : (
                <div className="w-4" />
              )}
            </Button>

            <User className="h-4 w-4 mr-2" />

            <div className="flex-1">
              <div className="font-medium">{node.name}</div>
              <div className="text-xs text-muted-foreground">{node.position}</div>
            </div>
          </div>

          <Badge variant="outline" className="mr-2">
            Level {node.level}
          </Badge>

          <Badge className="mr-2">{node.userType}</Badge>

          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="p-0 h-6 w-6" onClick={() => showUserDetails(node)}>
              <Info className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => showUserRights(node)}>
              Rights
            </Button>
          </div>
        </div>

        {node.expanded && node.children.map((child) => renderNode(child, level + 1))}
      </div>
    )
  }

  // Render the organizational chart
  const renderOrgChart = () => {
    if (!hierarchyData) return null

    // Helper function to render a node in the org chart
    const renderOrgNode = (node: HierarchyNode) => {
      return (
        <div key={node.id} className="flex flex-col items-center">
          <div className="flex flex-col items-center">
            <div
              className="border rounded-md p-2 bg-card w-40 text-center cursor-pointer"
              onClick={() => showUserDetails(node)}
            >
              <div className="font-medium truncate">{node.name}</div>
              <div className="text-xs text-muted-foreground truncate">{node.position}</div>
              <Badge className="mt-1" variant="outline">
                {node.userType}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" className="mt-1 h-6 px-2 text-xs" onClick={() => showUserRights(node)}>
              Manage Rights
            </Button>
          </div>

          {node.children.length > 0 && (
            <>
              <div className="w-px h-4 bg-border"></div>
              <div className="flex flex-row items-start">
                {node.children.map((child, index) => (
                  <div key={child.id} className="flex flex-col items-center">
                    {index > 0 && <div className="w-4"></div>}
                    {renderOrgNode(child)}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )
    }

    return (
      <div className="overflow-auto p-4">
        <div className="flex justify-center">{renderOrgNode(hierarchyData)}</div>
      </div>
    )
  }

  // Render the list view
  const renderListView = () => {
    if (!hierarchyData) return null

    // Flatten the hierarchy into a list
    const flattenHierarchy = (node: HierarchyNode, result: UserType[] = []): UserType[] => {
      result.push(node)
      node.children.forEach((child) => flattenHierarchy(child, result))
      return result
    }

    const users = flattenHierarchy(hierarchyData)

    // Group users by level
    const usersByLevel: Record<number, UserType[]> = {}
    users.forEach((user) => {
      if (!usersByLevel[user.level]) {
        usersByLevel[user.level] = []
      }
      usersByLevel[user.level].push(user)
    })

    // Sort levels
    const levels = Object.keys(usersByLevel)
      .map(Number)
      .sort((a, b) => a - b)

    return (
      <Tabs defaultValue={levels[0]?.toString()} className="w-full">
        <TabsList className="mb-4 w-full justify-start">
          {levels.map((level) => (
            <TabsTrigger key={level} value={level.toString()}>
              Level {level}
              <Badge variant="outline" className="ml-2">
                {usersByLevel[level].length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {levels.map((level) => (
          <TabsContent key={level} value={level.toString()} className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {usersByLevel[level].map((user) => (
                <Card key={user.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 border-b p-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.position}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Username</p>
                          <p>{user.username}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">User Type</p>
                          <p>{user.userType}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Email</p>
                          <p>{user.email}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-2 flex justify-between">
                    <Button variant="ghost" size="sm" onClick={() => showUserDetails(user)}>
                      <Info className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => showUserRights(user)}>
                      Manage Rights
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Team</CardTitle>
          <CardDescription>Loading team data...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Team</CardTitle>
          <CardDescription className="text-destructive">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Team</CardTitle>
            <CardDescription>
              {currentUser
                ? `Viewing hierarchy for ${currentUser.name} (${currentUser.position})`
                : "Team hierarchy view"}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant={viewMode === "tree" ? "default" : "outline"} size="sm" onClick={() => setViewMode("tree")}>
              Tree View
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              List View
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "tree" ? (
            <div className="border rounded-md p-2">{hierarchyData && renderNode(hierarchyData)}</div>
          ) : (
            renderListView()
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Organizational Chart</CardTitle>
          <CardDescription>Visual representation of your team structure</CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto">{renderOrgChart()}</CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={userDetailsOpen} onOpenChange={setUserDetailsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Detailed information about the selected user</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.position}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User ID</p>
                  <p>{selectedUser.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Username</p>
                  <p>{selectedUser.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User Type</p>
                  <p>{selectedUser.userType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Level</p>
                  <p>{selectedUser.level}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Parent ID</p>
                  <p>{selectedUser.parentId || "None (Root)"}</p>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Hierarchy Position</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Level {selectedUser.level}</Badge>
                  <Badge>{selectedUser.userType}</Badge>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    setUserDetailsOpen(false)
                    showUserRights(selectedUser)
                  }}
                >
                  Manage Rights
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* User Rights Management Dialog */}
      <Dialog open={userRightsOpen} onOpenChange={setUserRightsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Rights Management</DialogTitle>
            <DialogDescription>Manage access rights for different user types</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{selectedUser.name}</span>
                  <span className="text-sm text-muted-foreground">({selectedUser.position})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={selectedUserType} onValueChange={handleUserTypeChange}>
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
                  <Button onClick={saveUserRights}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Rights
                  </Button>
                </div>
              </div>

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
                            checked={userRights[module.id] && userRights[module.id].includes(right.id)}
                            onCheckedChange={() => handleRightToggle(module.id, right.id)}
                            className="mx-auto"
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
