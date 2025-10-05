import { ExternalLink } from "lucide-react"

export default function Footer() {
  const sources = [
    { name: "NASA TEMPO", url: "https://tempo.si.edu/" },
    { name: "NASA Worldview", url: "https://worldview.earthdata.nasa.gov/" },
    { name: "AirNow", url: "https://www.airnow.gov/" },
    { name: "NOAA", url: "https://www.noaa.gov/" },
  ]

  return (
    <footer className="border-t border-border bg-card/50 mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">Создано для NASA Space Apps Challenge 2025</p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="text-sm text-muted-foreground">Источники данных:</span>
            {sources.map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1 transition-colors"
              >
                {source.name}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
