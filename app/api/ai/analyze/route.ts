import { generateText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { pollutants, location, aqi } = await req.json()

  const prompt = `Analyze this air quality data and provide health insights:
Location: ${location}
AQI: ${aqi}
Pollutants: ${JSON.stringify(pollutants)}

Provide:
1. Health risk assessment
2. Recommended activities
3. Vulnerable groups to watch
4. Short-term forecast implications`

  const { text, usage } = await generateText({
    model: "openai/gpt-5",
    prompt,
    maxOutputTokens: 1000,
    temperature: 0.7,
  })

  return Response.json({ analysis: text, usage })
}
