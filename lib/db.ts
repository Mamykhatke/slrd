import type { User, Module, UserType, UserRight } from "./types"

// Storage keys for localStorage
const STORAGE_KEYS = {
  MODULES: "slrd_modules",
  USER_TYPES: "slrd_user_types",
  USERS: "slrd_users",
  USER_RIGHTS: "slrd_user_rights",
}

// In-memory database tables
let modules: Module[] = []
let userTypes: UserType[] = []
let users: (User & { password: string })[] = []
let userRights: UserRight[] = []
let initialized = false

// Helper function to load data from localStorage
function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const storedData = localStorage.getItem(key)
    return storedData ? JSON.parse(storedData) : defaultValue
  } catch (error) {
    console.error(`Error loading data from localStorage for key ${key}:`, error)
    return defaultValue
  }
}

// Helper function to save data to localStorage
function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving data to localStorage for key ${key}:`, error)
  }
}

// Initialize the database with seed data
export async function initDb() {
  if (initialized) return

  // Try to load data from localStorage first
  modules = loadFromStorage<Module[]>(STORAGE_KEYS.MODULES, [])
  userTypes = loadFromStorage<UserType[]>(STORAGE_KEYS.USER_TYPES, [])
  users = loadFromStorage<(User & { password: string })[]>(STORAGE_KEYS.USERS, [])
  userRights = loadFromStorage<UserRight[]>(STORAGE_KEYS.USER_RIGHTS, [])

  // If any of the tables are empty, seed with initial data
  if (modules.length === 0 || userTypes.length === 0 || users.length === 0 || userRights.length === 0) {
    // Seed modules
    modules = [
      { id: 1, detail: "Proj" },
      { id: 2, detail: "Proj-team" },
      { id: 3, detail: "Proj doc" },
      { id: 4, detail: "Proj Dis." },
    ]
    saveToStorage(STORAGE_KEYS.MODULES, modules)

    // Seed user types
    userTypes = [
      { id: 1, detail: "Admin" },
      { id: 2, detail: "Manager" },
      { id: 3, detail: "User" },
    ]
    saveToStorage(STORAGE_KEYS.USER_TYPES, userTypes)

    // Seed users with hierarchy
    users = [
      // Level 1 (Root)
      {
        id: 1,
        name: "John Smith",
        username: "johnsmith",
        password: "password123",
        email: "john.smith@slrd.com",
        position: "CEO",
        level: 1,
        parentId: null,
        userTypeId: 1,
        userType: "Admin",
      },

      // Level 2
      {
        id: 2,
        name: "Alice Johnson",
        username: "alicej",
        password: "password123",
        email: "alice.j@slrd.com",
        position: "CTO",
        level: 2,
        parentId: 1,
        userTypeId: 1,
        userType: "Admin",
      },
      {
        id: 3,
        name: "Bob Williams",
        username: "bobw",
        password: "password123",
        email: "bob.w@slrd.com",
        position: "CFO",
        level: 2,
        parentId: 1,
        userTypeId: 1,
        userType: "Admin",
      },
      {
        id: 4,
        name: "Carol Davis",
        username: "carold",
        password: "password123",
        email: "carol.d@slrd.com",
        position: "COO",
        level: 2,
        parentId: 1,
        userTypeId: 1,
        userType: "Admin",
      },

      // Level 3
      {
        id: 5,
        name: "David Miller",
        username: "davidm",
        password: "password123",
        email: "david.m@slrd.com",
        position: "Dev Lead",
        level: 3,
        parentId: 2,
        userTypeId: 2,
        userType: "Manager",
      },
      {
        id: 6,
        name: "Emma Wilson",
        username: "emmaw",
        password: "password123",
        email: "emma.w@slrd.com",
        position: "QA Lead",
        level: 3,
        parentId: 2,
        userTypeId: 2,
        userType: "Manager",
      },
      {
        id: 7,
        name: "Frank Thomas",
        username: "frankt",
        password: "password123",
        email: "frank.t@slrd.com",
        position: "Project Manager",
        level: 3,
        parentId: 3,
        userTypeId: 2,
        userType: "Manager",
      },
      {
        id: 8,
        name: "Grace Lee",
        username: "gracel",
        password: "password123",
        email: "grace.l@slrd.com",
        position: "HR Manager",
        level: 3,
        parentId: 4,
        userTypeId: 2,
        userType: "Manager",
      },
      {
        id: 9,
        name: "Henry Brown",
        username: "henryb",
        password: "password123",
        email: "henry.b@slrd.com",
        position: "Operations Manager",
        level: 3,
        parentId: 4,
        userTypeId: 2,
        userType: "Manager",
      },

      // Level 4
      {
        id: 10,
        name: "Ivy Chen",
        username: "ivyc",
        password: "password123",
        email: "ivy.c@slrd.com",
        position: "Developer",
        level: 4,
        parentId: 7,
        userTypeId: 3,
        userType: "User",
      },
      {
        id: 11,
        name: "Jack White",
        username: "jackw",
        password: "password123",
        email: "jack.w@slrd.com",
        position: "Developer",
        level: 4,
        parentId: 7,
        userTypeId: 3,
        userType: "User",
      },
      {
        id: 12,
        name: "Kelly Green",
        username: "kellyg",
        password: "password123",
        email: "kelly.g@slrd.com",
        position: "QA Engineer",
        level: 4,
        parentId: 7,
        userTypeId: 3,
        userType: "User",
      },
    ]
    saveToStorage(STORAGE_KEYS.USERS, users)

    // Seed user rights
    userRights = [
      // Admin rights (John Smith)
      { id: 1, userId: 1, moduleId: 1, rightId: "V" },
      { id: 2, userId: 1, moduleId: 1, rightId: "E" },
      { id: 3, userId: 1, moduleId: 1, rightId: "D" },
      { id: 4, userId: 1, moduleId: 1, rightId: "De" },
      { id: 5, userId: 1, moduleId: 1, rightId: "Ra" },
      { id: 6, userId: 1, moduleId: 2, rightId: "V" },
      { id: 7, userId: 1, moduleId: 2, rightId: "E" },
      { id: 8, userId: 1, moduleId: 2, rightId: "D" },
      { id: 9, userId: 1, moduleId: 2, rightId: "De" },
      { id: 10, userId: 1, moduleId: 2, rightId: "Ra" },
      { id: 11, userId: 1, moduleId: 3, rightId: "V" },
      { id: 12, userId: 1, moduleId: 3, rightId: "E" },
      { id: 13, userId: 1, moduleId: 3, rightId: "D" },
      { id: 14, userId: 1, moduleId: 3, rightId: "De" },
      { id: 15, userId: 1, moduleId: 3, rightId: "Ra" },
      { id: 16, userId: 1, moduleId: 4, rightId: "V" },
      { id: 17, userId: 1, moduleId: 4, rightId: "E" },
      { id: 18, userId: 1, moduleId: 4, rightId: "D" },
      { id: 19, userId: 1, moduleId: 4, rightId: "De" },
      { id: 20, userId: 1, moduleId: 4, rightId: "Ra" },

      // Manager rights (Frank Thomas)
      { id: 21, userId: 7, moduleId: 1, rightId: "V" },
      { id: 22, userId: 7, moduleId: 1, rightId: "E" },
      { id: 23, userId: 7, moduleId: 1, rightId: "De" },
      { id: 24, userId: 7, moduleId: 1, rightId: "Ra" },
      { id: 25, userId: 7, moduleId: 2, rightId: "V" },
      { id: 26, userId: 7, moduleId: 2, rightId: "E" },
      { id: 27, userId: 7, moduleId: 2, rightId: "D" },
      { id: 28, userId: 7, moduleId: 2, rightId: "De" },
      { id: 29, userId: 7, moduleId: 3, rightId: "V" },
      { id: 30, userId: 7, moduleId: 3, rightId: "E" },
      { id: 31, userId: 7, moduleId: 3, rightId: "De" },
      { id: 32, userId: 7, moduleId: 3, rightId: "Ra" },
      { id: 33, userId: 7, moduleId: 4, rightId: "V" },
      { id: 34, userId: 7, moduleId: 4, rightId: "E" },

      // User rights (Ivy Chen)
      { id: 35, userId: 10, moduleId: 1, rightId: "V" },
      { id: 36, userId: 10, moduleId: 2, rightId: "V" },
      { id: 37, userId: 10, moduleId: 3, rightId: "V" },
      { id: 38, userId: 10, moduleId: 3, rightId: "De" },
      { id: 39, userId: 10, moduleId: 4, rightId: "V" },
    ]
    saveToStorage(STORAGE_KEYS.USER_RIGHTS, userRights)
  }

  initialized = true
}

// User-related functions
export async function getAllUsers(): Promise<User[]> {
  await initDb()
  return users.map(({ password, ...user }) => user)
}

export async function getUserById(id: number): Promise<User | null> {
  await initDb()
  const user = users.find((u) => u.id === id)
  if (!user) return null

  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function getUsersByParentId(parentId: number): Promise<User[]> {
  await initDb()
  return users.filter((u) => u.parentId === parentId).map(({ password, ...user }) => user)
}

export async function getUserByUsername(username: string): Promise<(User & { password: string }) | null> {
  await initDb()
  return users.find((u) => u.username === username) || null
}

export async function createUser(userData: {
  name: string
  username: string
  password: string
  email: string
  position: string
  level: number
  parentId: number | null
  userTypeId: number
}): Promise<number> {
  await initDb()

  const userType = userTypes.find((ut) => ut.id === userData.userTypeId)
  if (!userType) throw new Error("User type not found")

  const newId = Math.max(...users.map((u) => u.id), 0) + 1

  const newUser: User & { password: string } = {
    id: newId,
    name: userData.name,
    username: userData.username,
    password: userData.password,
    email: userData.email,
    position: userData.position,
    level: userData.level,
    parentId: userData.parentId,
    userTypeId: userData.userTypeId,
    userType: userType.detail,
  }

  users.push(newUser)
  saveToStorage(STORAGE_KEYS.USERS, users)
  return newId
}

// Module-related functions
export async function getModules(): Promise<Module[]> {
  await initDb()
  return [...modules]
}

export async function updateModule(id: number, detail: string): Promise<boolean> {
  await initDb()

  const moduleIndex = modules.findIndex((m) => m.id === id)
  if (moduleIndex === -1) return false

  modules[moduleIndex].detail = detail
  saveToStorage(STORAGE_KEYS.MODULES, modules)

  return true
}

export async function addModule(detail: string): Promise<number> {
  await initDb()

  const newId = Math.max(...modules.map((m) => m.id), 0) + 1
  const newModule: Module = { id: newId, detail }

  modules.push(newModule)
  saveToStorage(STORAGE_KEYS.MODULES, modules)

  return newId
}

export async function deleteModule(id: number): Promise<boolean> {
  await initDb()

  const initialLength = modules.length
  modules = modules.filter((m) => m.id !== id)

  if (modules.length !== initialLength) {
    saveToStorage(STORAGE_KEYS.MODULES, modules)

    // Also delete any rights associated with this module
    const initialRightsLength = userRights.length
    userRights = userRights.filter((r) => r.moduleId !== id)

    if (userRights.length !== initialRightsLength) {
      saveToStorage(STORAGE_KEYS.USER_RIGHTS, userRights)
    }

    return true
  }

  return false
}

// User Type-related functions
export async function getUserTypes(): Promise<UserType[]> {
  await initDb()
  return [...userTypes]
}

export async function updateUserType(id: number, detail: string): Promise<boolean> {
  await initDb()

  const userTypeIndex = userTypes.findIndex((ut) => ut.id === id)
  if (userTypeIndex === -1) return false

  const oldDetail = userTypes[userTypeIndex].detail
  userTypes[userTypeIndex].detail = detail
  saveToStorage(STORAGE_KEYS.USER_TYPES, userTypes)

  // Update userType field in users table
  let usersUpdated = false
  users.forEach((user) => {
    if (user.userTypeId === id) {
      user.userType = detail
      usersUpdated = true
    }
  })

  if (usersUpdated) {
    saveToStorage(STORAGE_KEYS.USERS, users)
  }

  return true
}

export async function addUserType(detail: string): Promise<number> {
  await initDb()

  const newId = Math.max(...userTypes.map((ut) => ut.id), 0) + 1
  const newUserType: UserType = { id: newId, detail }

  userTypes.push(newUserType)
  saveToStorage(STORAGE_KEYS.USER_TYPES, userTypes)

  return newId
}

export async function deleteUserType(id: number): Promise<boolean> {
  await initDb()

  // Check if any users are using this user type
  const usersWithType = users.some((u) => u.userTypeId === id)
  if (usersWithType) {
    throw new Error("Cannot delete user type that is in use")
  }

  const initialLength = userTypes.length
  userTypes = userTypes.filter((ut) => ut.id !== id)

  if (userTypes.length !== initialLength) {
    saveToStorage(STORAGE_KEYS.USER_TYPES, userTypes)
    return true
  }

  return false
}

// Rights-related functions
export async function getRightsByUserId(userId: number): Promise<UserRight[]> {
  await initDb()
  return userRights.filter((r) => r.userId === userId)
}

export async function updateRightsForUser(
  userId: number,
  rights: { moduleId: number; rightId: string }[],
): Promise<void> {
  await initDb()

  // Remove existing rights for this user
  userRights = userRights.filter((r) => r.userId !== userId)

  // Add new rights
  let nextId = Math.max(...userRights.map((r) => r.id), 0) + 1

  for (const right of rights) {
    userRights.push({
      id: nextId++,
      userId,
      moduleId: right.moduleId,
      rightId: right.rightId,
    })
  }

  saveToStorage(STORAGE_KEYS.USER_RIGHTS, userRights)
}

// Database visualization for debugging
export async function getDatabaseState() {
  await initDb()

  return {
    modules,
    userTypes,
    users: users.map(({ password, ...user }) => user), // Exclude passwords
    userRights,
  }
}
