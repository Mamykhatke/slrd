import { NextResponse } from "next/server"
import { getUserTypes } from "@/lib/db"

export async function GET() {
  try {
    const userTypes = await getUserTypes()
    return NextResponse.json(userTypes)
  } catch (error) {
    console.error("Error fetching user types:", error)
    return NextResponse.json({ error: "Failed to fetch user types" }, { status: 500 })
  }
}
