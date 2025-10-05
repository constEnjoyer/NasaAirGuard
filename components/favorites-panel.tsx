"use client"

import { useState, useEffect } from "react"
import { Star, Trash2, MapPin } from "lucide-react"
import { getFavorites, removeFavorite, type FavoriteLocation } from "@/lib/favorites"
import { useAQIData } from "@/lib/use-aqi-data"

interface FavoritesPanelProps {
  onCitySelect: (code: string) => void
}

function getAQIColor(aqi: number): string {
  if (aqi <= 50) return "bg-green-500"
  if (aqi <= 100) return "bg-yellow-500"
  if (aqi <= 150) return "bg-orange-500"
  if (aqi <= 200) return "bg-red-500"
  return "bg-red-700"
}

function FavoriteCard({
  favorite,
  onSelect,
  onRemove,
}: { favorite: FavoriteLocation; onSelect: () => void; onRemove: () => void }) {
  const { data } = useAQIData(favorite.code as any)
  const aqi = data?.current?.aqi || 0

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <button onClick={onSelect} className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-gray-400" />
            <h3 className="font-semibold text-gray-900">{favorite.name}</h3>
          </div>
          <p className="text-xs text-gray-500">{favorite.country}</p>
        </button>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-600 transition-colors p-1"
          title="Remove from favorites"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      {data && (
        <div className="flex items-center gap-3">
          <div className={`${getAQIColor(aqi)} text-white px-3 py-1 rounded-full text-sm font-bold`}>{aqi}</div>
          <span className="text-xs text-gray-600">AQI</span>
        </div>
      )}
    </div>
  )
}

export default function FavoritesPanel({ onCitySelect }: FavoritesPanelProps) {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([])

  useEffect(() => {
    setFavorites(getFavorites())
  }, [])

  const handleRemove = (code: string) => {
    removeFavorite(code)
    setFavorites(getFavorites())
  }

  if (favorites.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
        <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="font-semibold text-gray-900 mb-2">No Favorite Locations</h3>
        <p className="text-sm text-gray-600">
          Add locations to your favorites to quickly access their air quality data
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        <h2 className="font-bold text-lg text-gray-900">Favorite Locations</h2>
        <span className="text-sm text-gray-500">({favorites.length})</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favorites.map((favorite) => (
          <FavoriteCard
            key={favorite.code}
            favorite={favorite}
            onSelect={() => onCitySelect(favorite.code)}
            onRemove={() => handleRemove(favorite.code)}
          />
        ))}
      </div>
    </div>
  )
}
