import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

// GET /api/plans - Retrieve user's project plans
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Fetch user's plans
    const { data: plans, error } = await supabase
      .from("project_plans")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching plans:", error)
      return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 })
    }

    return NextResponse.json({ plans })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/plans - Save a new project plan
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, ideaInput, planData } = body

    // Validate required fields
    if (!title || !description || !ideaInput || !planData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Save the plan
    const { data: plan, error } = await supabase
      .from("project_plans")
      .insert({
        user_id: user.id,
        title,
        description,
        idea_input: ideaInput,
        plan_data: planData,
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving plan:", error)
      return NextResponse.json({ error: "Failed to save plan" }, { status: 500 })
    }

    return NextResponse.json({ plan })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
