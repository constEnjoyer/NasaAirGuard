"use client"

import { useEffect, useRef, useState } from "react"
import { RotateCw, Play, Pause, Maximize2 } from "lucide-react"

interface View3DProps {
  selectedCity: "NYC" | "LA"
  activeLayers: string[]
}

export default function View3D({ selectedCity, activeLayers }: View3DProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [isPlaying])

  const handleRotate = () => {
    setRotation((prev) => prev + 90)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    }
  }

  return (
    <div className="w-full h-full bg-gray-900 relative flex items-center justify-center overflow-hidden">
      {/* Video Container */}
      <div
        className="relative transition-transform duration-500 ease-in-out"
        style={{
          transform: `rotate(${rotation}deg)`,
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      >
        <video
          ref={videoRef}
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/render0001-0250-WAEn3NIhbZMzHBPnErUtgh2csigxPd.mov"
          loop
          autoPlay
          muted
          playsInline
          className="max-w-full max-h-[calc(100vh-4rem)] object-contain"
        />
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-4 z-10">
        <button
          onClick={togglePlayPause}
          className="text-white hover:text-blue-400 transition-colors"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        <button onClick={handleRotate} className="text-white hover:text-blue-400 transition-colors" title="Rotate 90°">
          <RotateCw className="w-5 h-5" />
        </button>

        <button
          onClick={handleFullscreen}
          className="text-white hover:text-blue-400 transition-colors"
          title="Fullscreen"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Info Overlay */}
      <div className="absolute top-6 left-6 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-3 text-white">
        <div className="text-sm font-medium">3D Pollution Visualization</div>
        <div className="text-xs text-gray-300 mt-1">
          Active Layers: {activeLayers.length > 0 ? activeLayers.join(", ") : "None"}
        </div>
      </div>
    </div>
  )
}
