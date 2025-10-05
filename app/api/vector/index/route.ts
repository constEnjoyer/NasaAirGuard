import { vectorSearch } from "@/lib/vector-search"

export async function POST(req: Request) {
  const { id, location, aqi, pollutants } = await req.json()

  const initialized = await vectorSearch.initialize()

  if (!initialized) {
    return Response.json({ error: "Vector search not configured" }, { status: 503 })
  }

  const metadata = {
    location,
    timestamp: new Date().toISOString(),
    aqi,
    pollutants,
  }

  const text = `Air quality data for ${location}: AQI ${aqi}`
  const embedding = await vectorSearch.createEmbedding(text)

  await vectorSearch.upsertVector(id, embedding, metadata)

  return Response.json({ success: true, id })
}
