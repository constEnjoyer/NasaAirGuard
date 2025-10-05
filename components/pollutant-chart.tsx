"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PollutantChartProps {
  pollutantId: string
  selectedCity: "NYC" | "LA"
  aqiData: any
}

export default function PollutantChart({ pollutantId, selectedCity, aqiData }: PollutantChartProps) {
  const chartData = useMemo(() => {
    if (!aqiData?.trends) return []

    // Map pollutant IDs to data keys
    const dataKeyMap: Record<string, string> = {
      NO2: "no2",
      O3: "o3",
      HCHO: "hcho",
      AI: "aerosol_index",
      PM: "pm25",
    }

    const dataKey = dataKeyMap[pollutantId]
    if (!dataKey || !aqiData.trends[dataKey]) return []

    return aqiData.trends[dataKey].map((item: any) => ({
      date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: item.value,
    }))
  }, [aqiData, pollutantId])

  const getColor = (id: string) => {
    const colors: Record<string, string> = {
      NO2: "#ef4444",
      HCHO: "#f97316",
      AI: "#eab308",
      PM: "#a855f7",
      O3: "#3b82f6",
    }
    return colors[id] || "#6b7280"
  }

  if (!chartData.length) {
    return <div className="h-32 flex items-center justify-center text-xs text-gray-400">No data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height={120}>
      <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6b7280" }} />
        <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        <Line type="monotone" dataKey="value" stroke={getColor(pollutantId)} strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
