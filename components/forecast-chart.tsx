"use client"

import { useEffect, useRef, useState } from "react"
import { TrendingUp, Cloud, Wind, Droplets } from "lucide-react"
import { useAQIData } from "@/lib/use-aqi-data"

interface ForecastChartProps {
  selectedCity: "NYC" | "LA"
}

export default function ForecastChart({ selectedCity }: ForecastChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [chartInstance, setChartInstance] = useState<any>(null)

  const { data: aqiData, isLoading } = useAQIData(selectedCity)

  useEffect(() => {
    const initChart = async () => {
      if (!canvasRef.current || !aqiData) return

      const { Chart, registerables } = await import("chart.js")
      Chart.register(...registerables)

      if (chartInstance) {
        chartInstance.destroy()
      }

      const hours = aqiData.forecast.map((_: any, i: number) => `${i}:00`)
      const aqiValues = aqiData.forecast.map((f: any) => f.aqi)
      const o3Values = aqiData.forecast.map((f: any) => f.o3)
      const no2Values = aqiData.forecast.map((f: any) => f.no2)

      const ctx = canvasRef.current.getContext("2d")
      if (!ctx) return

      const newChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: hours,
          datasets: [
            {
              label: "Прогноз ИКВ",
              data: aqiValues,
              borderColor: "rgb(59, 130, 246)",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.4,
              fill: true,
              yAxisID: "y",
            },
            {
              label: "O₃ (мкг/м³)",
              data: o3Values,
              borderColor: "rgb(168, 85, 247)",
              backgroundColor: "rgba(168, 85, 247, 0.1)",
              tension: 0.4,
              fill: false,
              yAxisID: "y1",
              hidden: true,
            },
            {
              label: "NO₂ (мкг/м³)",
              data: no2Values,
              borderColor: "rgb(239, 68, 68)",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              tension: 0.4,
              fill: false,
              yAxisID: "y1",
              hidden: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false,
          },
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
              type: "linear",
              display: true,
              position: "left",
              beginAtZero: true,
              max: 200,
              title: {
                display: true,
                text: "ИКВ",
              },
            },
            y1: {
              type: "linear",
              display: true,
              position: "right",
              beginAtZero: true,
              title: {
                display: true,
                text: "Концентрация (мкг/м³)",
              },
              grid: {
                drawOnChartArea: false,
              },
            },
            x: {
              title: {
                display: true,
                text: "Час",
              },
            },
          },
        },
      })

      setChartInstance(newChart)
    }

    initChart()

    return () => {
      if (chartInstance) {
        chartInstance.destroy()
      }
    }
  }, [aqiData])

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return { text: "Хорошо", color: "text-green-500" }
    if (aqi <= 100) return { text: "Умеренно", color: "text-yellow-500" }
    if (aqi <= 150) return { text: "Вредно для чувствительных групп", color: "text-orange-500" }
    return { text: "Вредно", color: "text-red-500" }
  }

  const cityNames = {
    NYC: "Нью-Йорка",
    LA: "Лос-Анджелеса",
  }

  const currentAQI = aqiData?.current.aqi || 0
  const tomorrowAQI = aqiData?.forecast[23]?.aqi || 0
  const tomorrowStatus = getAQIStatus(tomorrowAQI)

  const weather = aqiData?.current.weather

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 shadow-lg h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            24-часовой прогноз с учетом метеоданных
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Прогноз на основе NO₂, O₃ и погодных условий для {cityNames[selectedCity]}
          </p>
        </div>
      </div>

      {weather && (
        <div className="flex gap-4 mb-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{weather.temperature}°C</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{weather.wind_speed} м/с</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{weather.precipitation} мм</span>
          </div>
        </div>
      )}

      <div className="h-[300px] mb-4">
        <canvas ref={canvasRef} />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Текущий ИКВ</p>
          <p className="text-3xl font-bold text-primary">{currentAQI}</p>
          <p className="text-xs text-muted-foreground mt-1">{getAQIStatus(currentAQI).text}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Прогноз на завтра</p>
          <p className={`text-3xl font-bold ${tomorrowStatus.color}`}>{tomorrowAQI}</p>
          <p className="text-xs text-muted-foreground mt-1">{tomorrowStatus.text}</p>
        </div>
      </div>
    </div>
  )
}
