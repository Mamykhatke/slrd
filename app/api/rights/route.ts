import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userTypeId = searchParams.get("userTypeId")

    if (!userTypeId) {
      return NextResponse.json({ error: "userTypeId is required" }, { status: 400 })
    }

    // In a real app, we would fetch rights for a user type
    // For now, we'll simulate this by returning a mock response
    const mockRights: Record<number, string[]> = {
      1: ["V", "E", "D", "De", "Ra"],
      2: ["V", "E", "D", "De", "Ra"],
      3: ["V", "E", "D", "De", "Ra"],
      4: ["V", "E", "D", "De", "Ra"],
    }

    return NextResponse.json(mockRights)
  } catch (error) {
    console.error("Error fetching rights:", error)
    return NextResponse.json({ error: "Failed to fetch rights" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { rights } = body

    if (!rights || !Array.isArray(rights)) {
      return NextResponse.json({ error: "Invalid rights data" }, { status: 400 })
    }

    // In a real app, we would update rights for a user type
    // For now, we'll just return success

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating rights:", error)
    return NextResponse.json({ error: "Failed to update rights" }, { status: 500 })
  }
}
