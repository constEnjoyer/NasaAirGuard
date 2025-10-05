import { vectorSearch } from "@/lib/vector-search"

export async function POST(req: Request) {
  const { location, aqi, pollutants } = await req.json()

  const initialized = await vectorSearch.initialize()

  if (!initialized) {
    return Response.json({ error: "Vector search not configured" }, { status: 503 })
  }

  const results = await vectorSearch.findSimilarPatterns(location, {
    location,
    timestamp: new Date().toISOString(),
    aqi,
    pollutants,
  })

  return Response.json({ results })
}
