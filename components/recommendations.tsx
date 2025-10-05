"use client"

import { useState } from "react"
import { ChevronDown, Heart, Activity, Users, AlertCircle } from "lucide-react"
import { useAQIData } from "@/lib/use-aqi-data"

interface RecommendationsProps {
  selectedCity: "NYC" | "LA"
}

export default function Recommendations({ selectedCity }: RecommendationsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const { data: aqiData } = useAQIData(selectedCity)
  const currentAQI = aqiData?.current.aqi || 0

  const cityNames = {
    NYC: "Нью-Йорке",
    LA: "Лос-Анджелесе",
  }

  const getRecommendations = () => {
    if (currentAQI > 100) {
      return [
        {
          icon: Heart,
          title: "Для людей с астмой",
          content:
            "⚠️ ВАЖНО: Используйте ингалятор профилактически перед выходом на улицу. Держите окна закрытыми. Обязательно используйте воздухоочистители с HEPA-фильтрами. Избегайте физических нагрузок на улице. При ухудшении симптомов немедленно обратитесь к врачу.",
          color: "text-red-500",
        },
        {
          icon: Activity,
          title: "Для активных людей",
          content:
            "Перенесите все физические упражнения в помещение. Если необходимо выйти на улицу, используйте маску N95. Полностью избегайте интенсивных тренировок. Пейте больше воды и следите за самочувствием.",
          color: "text-red-500",
        },
        {
          icon: Users,
          title: "Для семей с детьми",
          content:
            "Держите детей в помещении весь день. Закройте все окна и используйте воздухоочистители. Отмените все игры на улице. Следите за симптомами: кашель, затрудненное дыхание, раздражение глаз. При появлении симптомов обратитесь к врачу.",
          color: "text-red-500",
        },
        {
          icon: AlertCircle,
          title: "Общие рекомендации",
          content:
            "Оставайтесь в помещении с закрытыми окнами. Используйте кондиционер с чистыми фильтрами. Избегайте использования свечей, каминов и других источников дыма. Следите за обновлениями качества воздуха.",
          color: "text-red-500",
        },
      ]
    } else {
      return [
        {
          icon: Heart,
          title: "Для людей с астмой",
          content:
            "Держите ингалятор при себе на случай необходимости. Рассмотрите использование воздухоочистителей с HEPA-фильтрами в помещении для дополнительной защиты.",
          color: "text-blue-500",
        },
        {
          icon: Activity,
          title: "Для активных людей",
          content:
            "Планируйте физические упражнения на улице в ранние утренние часы, когда ИКВ обычно ниже. Пейте больше воды и делайте частые перерывы при интенсивных тренировках.",
          color: "text-blue-500",
        },
        {
          icon: Users,
          title: "Для семей с детьми",
          content:
            "Дети могут играть на улице, но следите за их самочувствием. При появлении кашля или затрудненного дыхания переместите активности в помещение.",
          color: "text-green-500",
        },
      ]
    }
  }

  const recommendations = getRecommendations()

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Рекомендации для здоровья</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Персонализированные советы на основе текущих условий качества воздуха в {cityNames[selectedCity]}
        {currentAQI > 100 && (
          <span className="block mt-2 text-red-500 font-semibold">
            ⚠️ Текущий ИКВ: {currentAQI} - Вредно для здоровья
          </span>
        )}
      </p>

      <div className="space-y-3">
        {recommendations.map((rec, index) => {
          const Icon = rec.icon
          const isOpen = openIndex === index

          return (
            <div key={index} className="border border-border rounded-lg overflow-hidden transition-all hover:shadow-md">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-4 flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${rec.color}`} />
                  <span className="font-medium text-left">{rec.title}</span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="p-4 bg-background animate-in slide-in-from-top-2 duration-200">
                  <p className="text-sm text-muted-foreground leading-relaxed">{rec.content}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
