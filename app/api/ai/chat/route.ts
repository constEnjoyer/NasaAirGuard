import { consumeStream, convertToModelMessages, streamText, type UIMessage, tool } from "ai"
import { z } from "zod"

export const maxDuration = 30

const getAirQualityTool = tool({
  description: "Get current air quality data for a specific location",
  inputSchema: z.object({
    location: z.string().describe("City or location name"),
  }),
  async execute({ location }) {
    // Mock data - in production this would call your actual API
    return {
      location,
      aqi: Math.floor(Math.random() * 200),
      pm25: Math.floor(Math.random() * 100),
      pm10: Math.floor(Math.random() * 150),
      no2: Math.floor(Math.random() * 80),
      o3: Math.floor(Math.random() * 120),
      so2: Math.floor(Math.random() * 50),
      co: Math.floor(Math.random() * 1000),
    }
  },
})

const getHealthRecommendationsTool = tool({
  description: "Get health recommendations based on air quality levels",
  inputSchema: z.object({
    aqi: z.number().describe("Air Quality Index value"),
  }),
  async execute({ aqi }) {
    if (aqi <= 50) {
      return {
        level: "Good",
        recommendations: ["Air quality is satisfactory", "Outdoor activities are safe", "No health concerns"],
      }
    } else if (aqi <= 100) {
      return {
        level: "Moderate",
        recommendations: [
          "Unusually sensitive people should limit prolonged outdoor exertion",
          "General public can enjoy outdoor activities",
        ],
      }
    } else if (aqi <= 150) {
      return {
        level: "Unhealthy for Sensitive Groups",
        recommendations: [
          "Sensitive groups should reduce prolonged outdoor exertion",
          "Children and elderly should limit outdoor activities",
        ],
      }
    } else {
      return {
        level: "Unhealthy",
        recommendations: [
          "Everyone should avoid prolonged outdoor exertion",
          "Stay indoors if possible",
          "Use air purifiers",
        ],
      }
    }
  },
})

const comparePollutantsTool = tool({
  description: "Compare pollutant levels across different locations",
  inputSchema: z.object({
    locations: z.array(z.string()).describe("List of locations to compare"),
  }),
  async execute({ locations }) {
    return locations.map((loc) => ({
      location: loc,
      aqi: Math.floor(Math.random() * 200),
      trend: Math.random() > 0.5 ? "improving" : "worsening",
    }))
  },
})

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const prompt = convertToModelMessages(messages)

  const result = streamText({
    model: "openai/gpt-5",
    prompt,
    system: `You are an air quality expert assistant. You help users understand air pollution data, health impacts, and provide recommendations. Use the available tools to fetch real-time data and provide accurate insights.`,
    tools: {
      getAirQuality: getAirQualityTool,
      getHealthRecommendations: getHealthRecommendationsTool,
      comparePollutants: comparePollutantsTool,
    },
    maxOutputTokens: 2000,
    temperature: 0.7,
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) {
        console.log("[v0] AI chat request aborted")
      }
    },
    consumeSseStream: consumeStream,
  })
}
