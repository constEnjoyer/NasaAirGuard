"use client"

import { useState } from "react"
import { BookOpen, ChevronDown, ChevronUp, AlertCircle, Factory, Wind } from "lucide-react"
import { POLLUTANTS_INFO, type PollutantInfo } from "@/lib/pollutant-info"

function PollutantCard({ pollutant }: { pollutant: PollutantInfo }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={`rounded-lg border-2 ${pollutant.color} overflow-hidden`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-black/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold">{pollutant.formula}</div>
          <div className="text-left">
            <h3 className="font-semibold">{pollutant.name}</h3>
            <p className="text-xs opacity-75">{pollutant.safeLevel}</p>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 space-y-4 border-t-2 border-current/20">
          <div>
            <p className="text-sm leading-relaxed">{pollutant.description}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Factory className="w-4 h-4" />
              <h4 className="font-semibold text-sm">Common Sources</h4>
            </div>
            <ul className="space-y-1 text-sm">
              {pollutant.sources.map((source, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-xs mt-1">•</span>
                  <span>{source}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4" />
              <h4 className="font-semibold text-sm">Health Effects</h4>
            </div>
            <ul className="space-y-1 text-sm">
              {pollutant.healthEffects.map((effect, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-xs mt-1">•</span>
                  <span>{effect}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PollutantEducation() {
  const pollutants = Object.values(POLLUTANTS_INFO)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="w-6 h-6 text-blue-600" />
        <div>
          <h2 className="font-bold text-xl text-gray-900">Pollutant Guide</h2>
          <p className="text-sm text-gray-500">Learn about air pollutants and their health impacts</p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <Wind className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Understanding Air Pollutants</p>
            <p className="text-blue-800">
              Air pollution consists of various harmful substances. Click on each pollutant below to learn about its
              sources, health effects, and safe exposure levels.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {pollutants.map((pollutant) => (
          <PollutantCard key={pollutant.id} pollutant={pollutant} />
        ))}
      </div>
    </div>
  )
}
