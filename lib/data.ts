// Module Table
export type Module = {
  id: number
  detail: string
}

// User Type Table
export type UserType = {
  id: number
  detail: string
}

// Rights
export type Right = {
  id: string
  label: string
}

// User Type Rights
export type UserTypeRight = {
  id: number
  userTypeId: number
  moduleId: number
  rights: string[]
}

// Dummy data for modules
export const modules: Module[] = [
  { id: 1, detail: "Proj" },
  { id: 2, detail: "Proj-team" },
  { id: 3, detail: "Proj doc" },
  { id: 4, detail: "Proj Dis." },
]

// Dummy data for user types
export const userTypes: UserType[] = [
  { id: 1, detail: "Admin" },
  { id: 2, detail: "Manager" },
  { id: 3, detail: "User" },
]

// Rights based on "VEDDeRa" from the image
export const rightTypes: Right[] = [
  { id: "V", label: "View" },
  { id: "E", label: "Edit" },
  { id: "D", label: "Delete" },
  { id: "De", label: "Download" },
  { id: "Ra", label: "Report Access" },
]

// Initial rights configuration
export const userTypeRights: Record<number, Record<number, string[]>> = {
  1: {
    // Admin
    1: ["V", "E", "D", "De", "Ra"], // Proj
    2: ["V", "E", "D", "De", "Ra"], // Proj-team
    3: ["V", "E", "D", "De", "Ra"], // Proj doc
    4: ["V", "E", "D", "De", "Ra"], // Proj Dis.
  },
  2: {
    // Manager
    1: ["V", "E", "De", "Ra"], // Proj
    2: ["V", "E", "D", "De"], // Proj-team
    3: ["V", "E", "De", "Ra"], // Proj doc
    4: ["V", "E"], // Proj Dis.
  },
  3: {
    // User
    1: ["V"], // Proj
    2: ["V"], // Proj-team
    3: ["V", "De"], // Proj doc
    4: ["V"], // Proj Dis.
  },
}
