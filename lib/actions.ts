"use server"

import { authenticateUser, clearSession } from "./auth"
import {
  createUser,
  updateRightsForUser,
  initDb,
  updateModule,
  addModule,
  deleteModule,
  updateUserType,
  addUserType,
  deleteUserType,
  getDatabaseState,
} from "./db"

// Initialize the database on server start
initDb()

export async function login(username: string, password: string) {
  try {
    const session = await authenticateUser(username, password)

    if (!session) {
      return { success: false, error: "Invalid username or password" }
    }

    return { success: true, session }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function logout() {
  try {
    await clearSession()
    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function addUser(userData: {
  name: string
  username: string
  password: string
  email: string
  position: string
  level: number
  parentId: number
  userTypeId: number
}) {
  try {
    const userId = await createUser(userData)
    return { success: true, userId }
  } catch (error) {
    console.error("Add user error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function updateUserRights(userId: number, rights: { moduleId: number; rightId: string }[]) {
  try {
    await updateRightsForUser(userId, rights)
    return { success: true }
  } catch (error) {
    console.error("Update user rights error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

// Module actions
export async function updateModuleAction(id: number, detail: string) {
  try {
    const success = await updateModule(id, detail)
    return { success }
  } catch (error) {
    console.error("Update module error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function addModuleAction(detail: string) {
  try {
    const moduleId = await addModule(detail)
    return { success: true, moduleId }
  } catch (error) {
    console.error("Add module error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function deleteModuleAction(id: number) {
  try {
    const success = await deleteModule(id)
    return { success }
  } catch (error) {
    console.error("Delete module error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

// User Type actions
export async function updateUserTypeAction(id: number, detail: string) {
  try {
    const success = await updateUserType(id, detail)
    return { success }
  } catch (error) {
    console.error("Update user type error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function addUserTypeAction(detail: string) {
  try {
    const userTypeId = await addUserType(detail)
    return { success: true, userTypeId }
  } catch (error) {
    console.error("Add user type error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function deleteUserTypeAction(id: number) {
  try {
    const success = await deleteUserType(id)
    return { success }
  } catch (error) {
    console.error("Delete user type error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

// Database visualization for debugging
export async function getDatabaseStateAction() {
  try {
    const dbState = await getDatabaseState()
    return { success: true, data: dbState }
  } catch (error) {
    console.error("Get database state error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
