import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useAQIData(city: "NYC" | "LA") {
  const { data, error, isLoading } = useSWR(`/api/aqi?city=${city}`, fetcher, {
    refreshInterval: 300000, // Refresh every 5 minutes
    revalidateOnFocus: false,
    dedupingInterval: 60000, // Dedupe requests within 1 minute
  })

  return {
    data,
    isLoading,
    isError: error,
  }
}
