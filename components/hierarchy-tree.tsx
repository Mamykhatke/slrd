"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronRight, Plus, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { User as UserType } from "@/lib/types"

interface HierarchyNodeProps {
  user: UserType
  children: UserType[]
  level: number
}

function HierarchyNode({ user, children, level }: HierarchyNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2)
  const hasChildren = children.length > 0

  return (
    <div className="ml-6 mt-2 first:mt-0">
      <div className="flex items-center gap-2">
        {hasChildren ? (
          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        ) : (
          <div className="w-5" />
        )}

        <Link href={`/hierarchy/${user.id}`}>
          <Card
            className={cn(
              "flex items-center gap-2 p-2 hover:bg-accent cursor-pointer",
              user.level === 1 && "bg-primary/10",
            )}
          >
            <User className="h-4 w-4" />
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">({user.position})</span>
          </Card>
        </Link>

        <Link href={`/hierarchy/${user.id}/add-user`}>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Plus className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {isExpanded && hasChildren && (
        <div className="border-l-2 border-border pl-2">
          {children.map((child) => (
            <HierarchyNode key={child.id} user={child} children={child.children || []} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

interface HierarchyTreeProps {
  users: UserType[]
}

export default function HierarchyTree({ users }: HierarchyTreeProps) {
  // Find the root user (level 1)
  const rootUser = users.find((user) => user.level === 1)

  if (!rootUser) {
    return <div className="text-center py-8">No hierarchy data found</div>
  }

  // Build the hierarchy tree
  const buildHierarchyTree = (users: UserType[]): UserType[] => {
    const userMap = new Map<number, UserType>()

    // Create a map of all users
    users.forEach((user) => {
      userMap.set(user.id, { ...user, children: [] })
    })

    const rootUsers: UserType[] = []

    // Build the tree structure
    users.forEach((user) => {
      if (user.parentId) {
        const parent = userMap.get(user.parentId)
        if (parent) {
          if (!parent.children) {
            parent.children = []
          }
          parent.children.push(userMap.get(user.id)!)
        }
      } else {
        rootUsers.push(userMap.get(user.id)!)
      }
    })

    return rootUsers
  }

  const hierarchyTree = buildHierarchyTree(users)

  return (
    <div className="p-4">
      {hierarchyTree.map((user) => (
        <HierarchyNode key={user.id} user={user} children={user.children || []} level={0} />
      ))}
    </div>
  )
}
