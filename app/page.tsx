"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Navigation,
} from "lucide-react"

// Mock weather data
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
    uvIndex: 6,
    visibility: 10,
  },
  hourly: [
    { time: "12 PM", temp: 72, icon: "partly-cloudy", precipitation: 10 },
    { time: "1 PM", temp: 74, icon: "sunny", precipitation: 0 },
    { time: "2 PM", temp: 76, icon: "sunny", precipitation: 0 },
    { time: "3 PM", temp: 75, icon: "partly-cloudy", precipitation: 5 },
    { time: "4 PM", temp: 73, icon: "cloudy", precipitation: 15 },
    { time: "5 PM", temp: 71, icon: "cloudy", precipitation: 20 },
    { time: "6 PM", temp: 69, icon: "partly-cloudy", precipitation: 10 },
    { time: "7 PM", temp: 67, icon: "partly-cloudy", precipitation: 5 },
    { time: "8 PM", temp: 65, icon: "cloudy", precipitation: 25 },
    { time: "9 PM", temp: 63, icon: "rainy", precipitation: 60 },
  ],
  daily: [
    { day: "Today", high: 76, low: 62, condition: "Partly Cloudy", icon: "partly-cloudy", precipitation: 20 },
    { day: "Tomorrow", high: 78, low: 64, condition: "Sunny", icon: "sunny", precipitation: 0 },
    { day: "Wednesday", high: 74, low: 60, condition: "Rainy", icon: "rainy", precipitation: 80 },
    { day: "Thursday", high: 71, low: 58, condition: "Cloudy", icon: "cloudy", precipitation: 30 },
    { day: "Friday", high: 73, low: 61, condition: "Partly Cloudy", icon: "partly-cloudy", precipitation: 10 },
    { day: "Saturday", high: 75, low: 63, condition: "Sunny", icon: "sunny", precipitation: 0 },
    { day: "Sunday", high: 77, low: 65, condition: "Sunny", icon: "sunny", precipitation: 5 },
  ],
}

const WeatherIcon = ({ icon, size = 24, className = "" }) => {
  const iconMap = {
    sunny: { icon: Sun, color: "text-yellow-400" },
    "partly-cloudy": { icon: Cloud, color: "text-blue-300" },
    cloudy: { icon: Cloud, color: "text-gray-400" },
    rainy: { icon: CloudRain, color: "text-blue-500" },
    snowy: { icon: CloudSnow, color: "text-blue-200" },
    stormy: { icon: Zap, color: "text-purple-400" },
  }

  const { icon: IconComponent, color } = iconMap[icon] || iconMap.sunny
  return <IconComponent size={size} className={`${color} ${className}`} />
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

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark")
    } else {
      setIsDarkMode(systemPrefersDark)
    }
  }, [])

  // Apply theme
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
    setTimeout(() => {
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

  const getBackgroundGradient = () => {
    const hour = currentTime.getHours()
    if (isDarkMode) {
      return "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    }

    if (hour >= 6 && hour < 12) {
      // Morning
      return "bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500"
    } else if (hour >= 12 && hour < 18) {
      // Afternoon
      return "bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-500"
    } else {
      // Evening/Night
      return "bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800"
    }
  }

  return (
    <div className={`min-h-screen ${getBackgroundGradient()} p-4 transition-all duration-1000`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Weather<span className="text-yellow-300">.</span>
            </h1>
            <div className="text-white/90 space-y-1">
              <p className="text-lg font-medium">{formatDate(currentTime)}</p>
              <p className="text-2xl font-mono font-light tracking-wider">{formatTime(currentTime)}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Temperature Unit Toggle */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
              <span className={`text-sm font-medium transition-colors ${!isCelsius ? "text-white" : "text-white/60"}`}>
                °F
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCelsius(!isCelsius)}
                className="p-1 text-white hover:bg-white/20 rounded-full"
              >
                {isCelsius ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
              </Button>
              <span className={`text-sm font-medium transition-colors ${isCelsius ? "text-white" : "text-white/60"}`}>
                °C
              </span>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-white hover:bg-white/20 rounded-full p-3 bg-white/10 backdrop-blur-md border border-white/20"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-8 bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <Input
                  placeholder="Search by city name or coordinates (lat,lon)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 h-12 rounded-xl focus:bg-white/30 transition-all"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-12 px-6 rounded-xl backdrop-blur-md transition-all"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              </Button>
              <Button
                type="button"
                onClick={getCurrentLocation}
                disabled={isLoading}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-12 px-6 rounded-xl backdrop-blur-md transition-all"
              >
                <Navigation size={20} />
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Weather - Main Card */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-white text-xl">
                  <MapPin size={24} className="text-yellow-300" />
                  {weatherData.current.location}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Main Weather Display */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md">
                      <WeatherIcon icon={weatherData.current.icon} size={80} />
                    </div>
                    <div>
                      <div className="text-6xl lg:text-7xl font-light text-white mb-2">
                        {convertTemp(weatherData.current.temperature)}
                        <span className="text-3xl text-white/80">{getTempUnit()}</span>
                      </div>
                      <div className="text-xl text-white/90 font-medium">{weatherData.current.condition}</div>
                      <div className="text-white/70 text-lg">
                        Feels like {convertTemp(weatherData.current.feelsLike)}
                        {getTempUnit()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weather Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      icon: Eye,
                      label: "Visibility",
                      value: `${weatherData.current.visibility} mi`,
                      color: "text-blue-300",
                    },
                    {
                      icon: Droplets,
                      label: "Humidity",
                      value: `${weatherData.current.humidity}%`,
                      color: "text-cyan-300",
                    },
                    {
                      icon: Wind,
                      label: "Wind Speed",
                      value: `${weatherData.current.windSpeed} mph`,
                      color: "text-green-300",
                    },
                    {
                      icon: Gauge,
                      label: "Pressure",
                      value: `${weatherData.current.pressure} in`,
                      color: "text-purple-300",
                    },
                    { icon: Sunrise, label: "Sunrise", value: weatherData.current.sunrise, color: "text-orange-300" },
                    { icon: Sunset, label: "Sunset", value: weatherData.current.sunset, color: "text-pink-300" },
                  ].map((stat, index) => (
                    <div key={index} className="bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10">
                      <div className="flex items-center gap-3">
                        <stat.icon size={24} className={stat.color} />
                        <div>
                          <div className="text-white/60 text-sm font-medium">{stat.label}</div>
                          <div className="text-white text-lg font-semibold">{stat.value}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Forecast */}
          <div>
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-xl">7-Day Forecast</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {weatherData.daily.map((day, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-xl p-4 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <WeatherIcon icon={day.icon} size={32} />
                        <div>
                          <div className="text-white font-medium">{day.day}</div>
                          <div className="text-white/60 text-sm">{day.condition}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-lg">
                            {convertTemp(day.high)}
                            {getTempUnit()}
                          </span>
                          <span className="text-white/60">
                            {convertTemp(day.low)}
                            {getTempUnit()}
                          </span>
                        </div>
                        <div className="text-cyan-300 text-sm">{day.precipitation}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hourly Forecast */}
        <Card className="mt-8 bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl">Hourly Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {weatherData.hourly.map((hour, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center min-w-[100px] bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="text-white/80 text-sm font-medium mb-3">{hour.time}</div>
                  <WeatherIcon icon={hour.icon} size={40} className="mb-3" />
                  <div className="text-white font-bold text-lg mb-2">
                    {convertTemp(hour.temp)}
                    {getTempUnit()}
                  </div>
                  <div className="text-cyan-300 text-xs">{hour.precipitation}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
