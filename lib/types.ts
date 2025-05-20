export interface User {
  id: number
  name: string
  username: string
  email: string
  position: string
  level: number
  parentId: number | null
  userTypeId: number
  userType: string
  children?: User[]
}

export interface Module {
  id: number
  detail: string
}

export interface UserType {
  id: number
  detail: string
}

export interface UserRight {
  id: number
  userId: number
  moduleId: number
  rightId: string
}

export interface Session {
  id: number
  userId: number
  username: string
  name: string
  userType: string
  level: number
}
