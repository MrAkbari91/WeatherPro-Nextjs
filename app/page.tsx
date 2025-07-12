"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  Zap,
  Eye,
  Droplets,
  Wind,
  Gauge,
  Sunrise,
  Sunset,
  MapPin,
  Search,
  Loader2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react"

// Mock weather data - in a real app, this would come from an API
const mockWeatherData = {
  current: {
    location: "New York, NY",
    temperature: 72,
    condition: "Partly Cloudy",
    feelsLike: 75,
    humidity: 65,
    windSpeed: 8,
    pressure: 30.12,
    sunrise: "6:24 AM",
    sunset: "7:45 PM",
    icon: "partly-cloudy",
  },
  hourly: [
    { time: "12 PM", temp: 72, icon: "partly-cloudy" },
    { time: "1 PM", temp: 74, icon: "sunny" },
    { time: "2 PM", temp: 76, icon: "sunny" },
    { time: "3 PM", temp: 75, icon: "partly-cloudy" },
    { time: "4 PM", temp: 73, icon: "cloudy" },
    { time: "5 PM", temp: 71, icon: "cloudy" },
    { time: "6 PM", temp: 69, icon: "partly-cloudy" },
    { time: "7 PM", temp: 67, icon: "partly-cloudy" },
  ],
  daily: [
    { day: "Today", high: 76, low: 62, condition: "Partly Cloudy", icon: "partly-cloudy" },
    { day: "Tomorrow", high: 78, low: 64, condition: "Sunny", icon: "sunny" },
    { day: "Wednesday", high: 74, low: 60, condition: "Rainy", icon: "rainy" },
    { day: "Thursday", high: 71, low: 58, condition: "Cloudy", icon: "cloudy" },
    { day: "Friday", high: 73, low: 61, condition: "Partly Cloudy", icon: "partly-cloudy" },
    { day: "Saturday", high: 75, low: 63, condition: "Sunny", icon: "sunny" },
    { day: "Sunday", high: 77, low: 65, condition: "Sunny", icon: "sunny" },
  ],
}

const WeatherIcon = ({ icon, size = 24 }) => {
  const iconMap = {
    sunny: Sun,
    "partly-cloudy": Cloud,
    cloudy: Cloud,
    rainy: CloudRain,
    snowy: CloudSnow,
    stormy: Zap,
  }

  const IconComponent = iconMap[icon] || Sun
  return <IconComponent size={size} />
}

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState(mockWeatherData)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isCelsius, setIsCelsius] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark")
    } else {
      setIsDarkMode(systemPrefersDark)
    }
  }, [])

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  const convertTemp = (temp) => {
    if (isCelsius) {
      return Math.round(((temp - 32) * 5) / 9)
    }
    return temp
  }

  const getTempUnit = () => (isCelsius ? "°C" : "°F")

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would fetch data from weather API here
      setWeatherData({
        ...mockWeatherData,
        current: {
          ...mockWeatherData.current,
          location: searchQuery,
        },
      })
      setIsLoading(false)
    }, 1000)
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would use these coordinates to fetch weather data
          console.log("Latitude:", position.coords.latitude)
          console.log("Longitude:", position.coords.longitude)

          // Simulate API call with coordinates
          setTimeout(() => {
            setWeatherData({
              ...mockWeatherData,
              current: {
                ...mockWeatherData.current,
                location: "Current Location",
              },
            })
            setIsLoading(false)
          }, 1000)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLoading(false)
        },
      )
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Weather App</h1>
            <div className="text-white/80">
              <p className="text-lg">{formatDate(currentTime)}</p>
              <p className="text-xl font-mono">{formatTime(currentTime)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Temperature Unit Toggle */}
            <div className="flex items-center gap-2 text-white">
              <span className={!isCelsius ? "font-bold" : ""}>°F</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCelsius(!isCelsius)}
                className="p-1 text-white hover:bg-white/20"
              >
                {isCelsius ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </Button>
              <span className={isCelsius ? "font-bold" : ""}>°C</span>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-white hover:bg-white/20"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Search by city name or coordinates (lat,lon)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              </Button>
              <Button
                type="button"
                onClick={getCurrentLocation}
                disabled={isLoading}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <MapPin size={20} />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Current Weather */}
        <Card className="mb-6 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MapPin size={20} />
              {weatherData.current.location}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Main Weather Info */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  <WeatherIcon icon={weatherData.current.icon} size={64} />
                  <div>
                    <div className="text-5xl font-bold text-white">
                      {convertTemp(weatherData.current.temperature)}
                      {getTempUnit()}
                    </div>
                    <div className="text-white/80">{weatherData.current.condition}</div>
                  </div>
                </div>
                <div className="text-white/80">
                  Feels like {convertTemp(weatherData.current.feelsLike)}
                  {getTempUnit()}
                </div>
              </div>

              {/* Weather Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-white">
                  <Eye size={20} className="text-white/60" />
                  <div>
                    <div className="text-sm text-white/60">Visibility</div>
                    <div>10 mi</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Droplets size={20} className="text-white/60" />
                  <div>
                    <div className="text-sm text-white/60">Humidity</div>
                    <div>{weatherData.current.humidity}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Wind size={20} className="text-white/60" />
                  <div>
                    <div className="text-sm text-white/60">Wind</div>
                    <div>{weatherData.current.windSpeed} mph</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Gauge size={20} className="text-white/60" />
                  <div>
                    <div className="text-sm text-white/60">Pressure</div>
                    <div>{weatherData.current.pressure} in</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Sunrise size={20} className="text-white/60" />
                  <div>
                    <div className="text-sm text-white/60">Sunrise</div>
                    <div>{weatherData.current.sunrise}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Sunset size={20} className="text-white/60" />
                  <div>
                    <div className="text-sm text-white/60">Sunset</div>
                    <div>{weatherData.current.sunset}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hourly Forecast */}
        <Card className="mb-6 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Hourly Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {weatherData.hourly.map((hour, index) => (
                <div key={index} className="flex flex-col items-center min-w-[80px] text-white">
                  <div className="text-sm text-white/80 mb-2">{hour.time}</div>
                  <WeatherIcon icon={hour.icon} size={32} />
                  <div className="text-lg font-semibold mt-2">
                    {convertTemp(hour.temp)}
                    {getTempUnit()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Forecast */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">7-Day Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weatherData.daily.map((day, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-16 text-sm text-white/80">{day.day}</div>
                      <WeatherIcon icon={day.icon} size={24} />
                      <div className="text-sm text-white/80">{day.condition}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {convertTemp(day.high)}
                        {getTempUnit()}
                      </span>
                      <span className="text-white/60">
                        {convertTemp(day.low)}
                        {getTempUnit()}
                      </span>
                    </div>
                  </div>
                  {index < weatherData.daily.length - 1 && <Separator className="mt-3 bg-white/20" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
