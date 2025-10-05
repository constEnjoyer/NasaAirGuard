"use client"

import { AlertTriangle, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAQIData } from "@/lib/use-aqi-data"
import { useState, useEffect, forwardRef, useImperativeHandle } from "react"

interface AlertsBoxProps {
  selectedCity: "NYC" | "LA"
}

export interface AlertsBoxRef {
  triggerNotification: () => void
}

const DEMO_NOTIFICATIONS = [
  {
    pollutant: "NO₂",
    value: 42,
    severity: "high",
    message:
      "⚠️ Высокий уровень NO₂ обнаружен в центре города. Рекомендуется избегать интенсивных физических нагрузок на улице.",
    icon: "🚗",
    timestamp: new Date().toISOString(),
  },
  {
    pollutant: "O₃",
    value: 85,
    severity: "moderate",
    message:
      "☀️ Повышенная концентрация озона из-за солнечной активности. Людям с астмой рекомендуется оставаться в помещении.",
    icon: "☀️",
    timestamp: new Date().toISOString(),
  },
  {
    pollutant: "PM2.5",
    value: 38,
    severity: "high",
    message: "💨 Критический уровень мелких частиц PM2.5. Используйте маски при выходе на улицу.",
    icon: "💨",
    timestamp: new Date().toISOString(),
  },
  {
    pollutant: "AQI",
    value: 156,
    severity: "high",
    message: "📊 Общий индекс качества воздуха достиг нездорового уровня. Закройте окна и включите очистители воздуха.",
    icon: "📊",
    timestamp: new Date().toISOString(),
  },
  {
    pollutant: "NO₂",
    value: 28,
    severity: "moderate",
    message: "🚦 Умеренное загрязнение NO₂ из-за пробок в час пик. Планируйте поездки на общественном транспорте.",
    icon: "🚗",
    timestamp: new Date().toISOString(),
  },
  {
    pollutant: "O₃",
    value: 95,
    severity: "high",
    message: "🌡️ Экстремальная концентрация озона! Детям и пожилым людям не рекомендуется выходить на улицу.",
    icon: "☀️",
    timestamp: new Date().toISOString(),
  },
]

const AlertsBox = forwardRef<AlertsBoxRef, AlertsBoxProps>(({ selectedCity }, ref) => {
  const { data: aqiData, isLoading } = useAQIData(selectedCity)
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0)
  const [showNewNotification, setShowNewNotification] = useState(false)
  const [notificationHistory, setNotificationHistory] = useState<any[]>([])

  const triggerNotification = () => {
    setShowNewNotification(true)
    const nextNotification = {
      ...DEMO_NOTIFICATIONS[currentNotificationIndex],
      timestamp: new Date().toISOString(),
    }

    setNotificationHistory((prev) => [nextNotification, ...prev.slice(0, 4)])
    setCurrentNotificationIndex((prev) => (prev + 1) % DEMO_NOTIFICATIONS.length)

    setTimeout(() => setShowNewNotification(false), 1000)
  }

  useImperativeHandle(ref, () => ({
    triggerNotification,
  }))

  useEffect(() => {
    const interval = setInterval(() => {
      triggerNotification()
    }, 20000)

    if (notificationHistory.length === 0) {
      setNotificationHistory([
        {
          ...DEMO_NOTIFICATIONS[0],
          timestamp: new Date().toISOString(),
        },
      ])
    }

    return () => clearInterval(interval)
  }, [currentNotificationIndex, notificationHistory.length])

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 shadow-lg h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-lg h-full relative">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        <h2 className="text-lg font-semibold">Умные уведомления о качестве воздуха</h2>
        {showNewNotification && (
          <span className="ml-auto text-xs font-bold text-green-600 dark:text-green-400 animate-pulse">
            НОВОЕ УВЕДОМЛЕНИЕ
          </span>
        )}
      </div>

      <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
        {notificationHistory.map((alert: any, index: number) => (
          <div
            key={`${alert.timestamp}-${index}`}
            className={`p-4 rounded-lg border transition-all duration-500 hover:shadow-md ${
              alert.severity === "high" ? "bg-red-500/10 border-red-500/30" : "bg-yellow-500/10 border-yellow-500/30"
            } ${index === 0 && showNewNotification ? "animate-in slide-in-from-top-5 scale-in-95" : ""}`}
            style={{
              opacity: index === 0 ? 1 : 0.7 - index * 0.15,
            }}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{alert.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      alert.severity === "high" ? "bg-red-500 text-white" : "bg-yellow-500 text-white"
                    }`}
                  >
                    {alert.pollutant}
                  </span>
                  <span className="text-xs text-muted-foreground">{alert.value} мкг/м³</span>
                  {index === 0 && showNewNotification && (
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 ml-auto">СЕЙЧАС</span>
                  )}
                </div>
                <p className="text-sm font-medium leading-relaxed">{alert.message}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(alert.timestamp).toLocaleString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button className="w-full" variant="default">
        <Bell className="w-4 h-4 mr-2" />
        Подписаться на push-уведомления
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-3">
        Получайте персонализированные уведомления при превышении порогов NO₂, O₃ и PM2.5
      </p>
    </div>
  )
})

AlertsBox.displayName = "AlertsBox"

export default AlertsBox
