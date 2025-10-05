"use client"

import { useEffect, useRef, useState } from "react"
import { TrendingUp } from "lucide-react"
import { useAQIData } from "@/lib/use-aqi-data"

interface TrendsChartProps {
  selectedCity: "NYC" | "LA"
}

export default function TrendsChart({ selectedCity }: TrendsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<any>(null)
  const [selectedPollutant, setSelectedPollutant] = useState<"no2" | "pm25" | "o3">("no2")

  const { data: aqiData, isLoading } = useAQIData(selectedCity)

  useEffect(() => {
    const initChart = async () => {
      if (!canvasRef.current || !aqiData?.trends) return

      const { Chart, registerables } = await import("chart.js")
      Chart.register(...registerables)

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
        chartInstanceRef.current = null
      }

      const trendData = aqiData.trends[selectedPollutant]
      const labels = trendData.map((d: any) => {
        const date = new Date(d.date)
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      })
      const values = trendData.map((d: any) => d.value)

      const pollutantConfig = {
        no2: { label: "NO₂ (мкг/м³)", color: "rgb(239, 68, 68)", bg: "rgba(239, 68, 68, 0.1)" },
        pm25: { label: "PM2.5 (мкг/м³)", color: "rgb(249, 115, 22)", bg: "rgba(249, 115, 22, 0.1)" },
        o3: { label: "O₃ (мкг/м³)", color: "rgb(168, 85, 247)", bg: "rgba(168, 85, 247, 0.1)" },
      }

      const config = pollutantConfig[selectedPollutant]

      const ctx = canvasRef.current.getContext("2d")
      if (!ctx) return

      const newChart = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: config.label,
              data: values,
              borderColor: config.color,
              backgroundColor: config.bg,
              tension: 0.4,
              fill: true,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Концентрация",
              },
            },
            x: {
              title: {
                display: true,
                text: "Дата",
              },
            },
          },
        },
      })

      chartInstanceRef.current = newChart
    }

    initChart()

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
        chartInstanceRef.current = null
      }
    }
  }, [aqiData, selectedPollutant])

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 shadow-lg h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  const currentValue = aqiData?.trends[selectedPollutant][6]?.value || 0
  const previousValue = aqiData?.trends[selectedPollutant][0]?.value || 0
  const change = (((currentValue - previousValue) / previousValue) * 100).toFixed(1)
  const isIncreasing = currentValue > previousValue

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            7-дневный тренд загрязнителей
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Динамика изменения концентрации за неделю</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSelectedPollutant("no2")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedPollutant === "no2" ? "bg-red-500 text-white" : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          NO₂
        </button>
        <button
          onClick={() => setSelectedPollutant("pm25")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedPollutant === "pm25" ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          PM2.5
        </button>
        <button
          onClick={() => setSelectedPollutant("o3")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedPollutant === "o3" ? "bg-purple-500 text-white" : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          O₃
        </button>
      </div>

      <div className="h-[250px] mb-4">
        <canvas ref={canvasRef} />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div>
          <p className="text-sm text-muted-foreground">Текущее значение</p>
          <p className="text-2xl font-bold text-primary">{currentValue}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Изменение за 7 дней</p>
          <p className={`text-2xl font-bold ${isIncreasing ? "text-red-500" : "text-green-500"}`}>
            {isIncreasing ? "+" : ""}
            {change}%
          </p>
        </div>
      </div>
    </div>
  )
}
