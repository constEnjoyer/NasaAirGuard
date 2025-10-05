export interface FavoriteLocation {
  code: string
  name: string
  country: string
  addedAt: string
}

const STORAGE_KEY = "airguard_favorites"

export function getFavorites(): FavoriteLocation[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addFavorite(location: Omit<FavoriteLocation, "addedAt">): void {
  const favorites = getFavorites()
  if (favorites.some((fav) => fav.code === location.code)) return

  const newFavorite: FavoriteLocation = {
    ...location,
    addedAt: new Date().toISOString(),
  }

  favorites.push(newFavorite)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
}

export function removeFavorite(code: string): void {
  const favorites = getFavorites()
  const filtered = favorites.filter((fav) => fav.code !== code)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function isFavorite(code: string): boolean {
  return getFavorites().some((fav) => fav.code === code)
}
