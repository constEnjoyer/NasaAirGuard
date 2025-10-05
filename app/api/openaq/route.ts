import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const radius = searchParams.get("radius") || "25000"

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing lat or lng parameters" }, { status: 400 })
  }

  const apiKey = process.env.OPENAQ_API_KEY

  if (!apiKey) {
    console.error("[v0] Missing OPENAQ_API_KEY environment variable")
    return NextResponse.json(
      {
        error: "OpenAQ API key not configured",
        message: "Please add OPENAQ_API_KEY to your environment variables",
        results: [],
      },
      { status: 200 },
    )
  }

  try {
    console.log("[v0] Fetching OpenAQ data for:", { lat, lng, radius })

    const url = `https://api.openaq.org/v3/locations?coordinates=${lat},${lng}&radius=${radius}&limit=200&order_by=id&parameters_id=2,3,7,10,19,130`

    console.log("[v0] OpenAQ API URL:", url)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-API-Key": apiKey,
      },
      signal: AbortSignal.timeout(10000),
    })

    console.log("[v0] OpenAQ API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] OpenAQ API error:", response.status, errorText)

      if (response.status === 401 || response.status === 403) {
        return NextResponse.json({
          error: "Invalid OpenAQ API key",
          message: "Please check your OPENAQ_API_KEY environment variable",
          results: [],
        })
      }

      throw new Error(`OpenAQ API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] OpenAQ data received:", data.results?.length || 0, "locations")

    return NextResponse.json({
      results: data.results || [],
      meta: data.meta || {},
    })
  } catch (error: any) {
    console.error("[v0] OpenAQ API error:", error.message)
    return NextResponse.json({
      results: [],
      meta: {},
      error: error.message,
    })
  }
}
