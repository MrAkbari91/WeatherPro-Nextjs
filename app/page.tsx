"use client"

import { useState, useEffect, useRef } from "react"
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
  Navigation,
  Calendar,
  Clock,
  Thermometer,
  Umbrella,
  AlertCircle,
  Globe,
  ArrowUp,
} from "lucide-react"

const API_KEY = "ca799e241c694d886db7c9f33b5dbedd"

const WeatherIcon = ({ icon, size = 24, className = "" }) => {
  const iconMap = {
    "01d": { icon: Sun, color: "text-yellow-500" },
    "01n": { icon: Moon, color: "text-blue-300" },
    "02d": { icon: Cloud, color: "text-blue-500" },
    "02n": { icon: Cloud, color: "text-slate-400" },
    "03d": { icon: Cloud, color: "text-gray-500" },
    "03n": { icon: Cloud, color: "text-gray-400" },
    "04d": { icon: Cloud, color: "text-gray-600" },
    "04n": { icon: Cloud, color: "text-gray-500" },
    "09d": { icon: CloudRain, color: "text-blue-600" },
    "09n": { icon: CloudRain, color: "text-blue-500" },
    "10d": { icon: CloudRain, color: "text-blue-500" },
    "10n": { icon: CloudRain, color: "text-blue-400" },
    "11d": { icon: Zap, color: "text-purple-600" },
    "11n": { icon: Zap, color: "text-purple-500" },
    "13d": { icon: CloudSnow, color: "text-blue-300" },
    "13n": { icon: CloudSnow, color: "text-blue-200" },
    "50d": { icon: Cloud, color: "text-gray-500" },
    "50n": { icon: Cloud, color: "text-gray-400" },
  }

  const { icon: IconComponent, color } = iconMap[icon] || iconMap["01d"]
  return <IconComponent size={size} className={`${color} ${className} drop-shadow-sm`} />
}

const WindDirectionArrow = ({ degree, className = "" }) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <ArrowUp
        size={16}
        className="text-emerald-600 dark:text-emerald-400"
        style={{
          transform: `rotate(${degree}deg)`,
          transformOrigin: "center",
        }}
      />
    </div>
  )
}

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [locationData, setLocationData] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isCelsius, setIsCelsius] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [error, setError] = useState(null)
  const [isAnimated, setIsAnimated] = useState(false)
  const [locationStatus, setLocationStatus] = useState("detecting")

  const dailySliderRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

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

  // Initialize app
  useEffect(() => {
    initializeApp()
  }, [])

  // Trigger animations
  useEffect(() => {
    if (weatherData && !isAnimated) {
      setTimeout(() => setIsAnimated(true), 100)
    }
  }, [weatherData, isAnimated])

  const initializeApp = async () => {
    try {
      setLocationStatus("detecting")
      await getLocationFromIP()
    } catch (error) {
      console.error("Failed to get location from IP:", error)
      setLocationStatus("error")
      await fetchWeatherByCity("New York")
    }
  }

  const getLocationFromIP = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/")
      if (!response.ok) throw new Error("Failed to get location data")

      const locationInfo = await response.json()
      if (locationInfo.error) throw new Error(locationInfo.reason || "Location service error")

      setLocationData(locationInfo)
      setLocationStatus("success")
      await fetchWeatherData(locationInfo.latitude, locationInfo.longitude)
    } catch (error) {
      console.error("IP location error:", error)
      setLocationStatus("error")
      throw error
    }
  }

  const fetchWeatherData = async (lat, lon) => {
    try {
      setIsLoading(true)
      setError(null)

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
      )
      if (!weatherResponse.ok) throw new Error("Weather data not available")
      const weather = await weatherResponse.json()

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
      )
      if (!forecastResponse.ok) throw new Error("Forecast data not available")
      const forecast = await forecastResponse.json()

      setWeatherData(weather)
      setForecastData(forecast)
    } catch (err) {
      setError(err.message)
      console.error("Error fetching weather data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchWeatherByCity = async (cityName) => {
    try {
      setIsLoading(true)
      setError(null)

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`,
      )
      if (!weatherResponse.ok) throw new Error("City not found")
      const weather = await weatherResponse.json()

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${weather.coord.lat}&lon=${weather.coord.lon}&appid=${API_KEY}&units=metric`,
      )
      const forecast = await forecastResponse.json()

      setWeatherData(weather)
      setForecastData(forecast)
      setLocationData(null)
      setLocationStatus("success")
    } catch (err) {
      setError(err.message)
      console.error("Error fetching weather data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const convertTemp = (temp) => {
    if (isCelsius) {
      return Math.round(temp)
    }
    return Math.round((temp * 9) / 5 + 32)
  }

  const getTempUnit = () => (isCelsius ? "°C" : "°F")

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    await fetchWeatherByCity(searchQuery)
    setSearchQuery("")
  }

  const refreshLocation = async () => {
    try {
      setLocationStatus("detecting")
      await getLocationFromIP()
    } catch (error) {
      console.error("Failed to refresh location:", error)
      setLocationStatus("error")
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
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

  const getWeatherBasedBackground = () => {
    if (!weatherData) {
      return isDarkMode
        ? "bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900"
        : "bg-gradient-to-br from-blue-100 via-sky-200 to-indigo-300"
    }

    const weatherId = weatherData.weather[0].id
    const isDay = weatherData.weather[0].icon.includes("d")

    if (weatherId >= 200 && weatherId < 300) {
      // Thunderstorm
      return isDarkMode
        ? "bg-gradient-to-br from-gray-900 via-purple-900 to-slate-900"
        : "bg-gradient-to-br from-gray-400 via-purple-300 to-gray-500"
    } else if (weatherId >= 300 && weatherId < 600) {
      // Rain
      return isDarkMode
        ? "bg-gradient-to-br from-slate-800 via-blue-900 to-gray-900"
        : "bg-gradient-to-br from-blue-200 via-slate-300 to-blue-400"
    } else if (weatherId >= 600 && weatherId < 700) {
      // Snow
      return isDarkMode
        ? "bg-gradient-to-br from-blue-900 via-slate-800 to-blue-900"
        : "bg-gradient-to-br from-blue-100 via-white to-slate-200"
    } else if (weatherId >= 700 && weatherId < 800) {
      // Atmosphere
      return isDarkMode
        ? "bg-gradient-to-br from-gray-800 via-slate-700 to-gray-800"
        : "bg-gradient-to-br from-gray-200 via-slate-200 to-gray-300"
    } else if (weatherId === 800) {
      // Clear
      return isDarkMode
        ? isDay
          ? "bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900"
          : "bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800"
        : isDay
          ? "bg-gradient-to-br from-yellow-200 via-orange-300 to-red-300"
          : "bg-gradient-to-br from-indigo-200 via-purple-300 to-pink-300"
    } else {
      // Clouds
      return isDarkMode
        ? "bg-gradient-to-br from-gray-800 via-slate-700 to-gray-800"
        : "bg-gradient-to-br from-gray-200 via-slate-300 to-gray-400"
    }
  }

  const getHourlyForecast = () => {
    if (!forecastData) return []
    return forecastData.list.slice(0, 8).map((item) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      temp: item.main.temp,
      icon: item.weather[0].icon,
      precipitation: Math.round(item.pop * 100),
      windSpeed: Math.round(item.wind.speed * 3.6),
      windDeg: item.wind.deg,
      description: item.weather[0].description,
    }))
  }

  const getDailyForecast = () => {
    if (!forecastData) return []

    const dailyData = {}
    forecastData.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString()
      if (!dailyData[date]) {
        dailyData[date] = {
          date: new Date(item.dt * 1000),
          temps: [],
          weather: item.weather[0],
          precipitation: item.pop,
          windSpeed: item.wind.speed,
          windDeg: item.wind.deg,
        }
      }
      dailyData[date].temps.push(item.main.temp)
    })

    return Object.values(dailyData)
      .slice(0, 7)
      .map((day, index) => ({
        day: index === 0 ? "Today" : day.date.toLocaleDateString("en-US", { weekday: "long" }),
        date: day.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        high: Math.max(...day.temps),
        low: Math.min(...day.temps),
        condition: day.weather.main,
        icon: day.weather.icon,
        precipitation: Math.round(day.precipitation * 100),
        windSpeed: Math.round(day.windSpeed * 3.6),
        windDeg: day.windDeg,
        description: day.weather.description,
      }))
  }

  const getWindDirection = (degree) => {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ]
    const index = Math.round(degree / 22.5) % 16
    return directions[index]
  }

  // Drag handlers for daily forecast
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - dailySliderRef.current.offsetLeft)
    setScrollLeft(dailySliderRef.current.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - dailySliderRef.current.offsetLeft
    const walk = (x - startX) * 2
    dailySliderRef.current.scrollLeft = scrollLeft - walk
  }

  const getLocationStatusMessage = () => {
    if (locationData) {
      return `Auto-detected: ${locationData.city}, ${locationData.region}, ${locationData.country_name}`
    }

    switch (locationStatus) {
      case "detecting":
        return "Detecting your location automatically..."
      case "error":
        return "Using default location - location detection failed"
      case "success":
        return "Location detected successfully"
      default:
        return ""
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 flex items-center justify-center p-4">
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-red-200 dark:border-red-700 shadow-2xl max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Weather Unavailable</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600 text-white">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${getWeatherBasedBackground()} transition-all duration-1000`}>
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        {/* Header Section - Site Name Left, Controls Right */}
        <div
          className={`flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-6 lg:space-y-0 transform transition-all duration-1000 ${isAnimated ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          {/* Left Side - Site Name and Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div
                className={`p-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl border border-gray-300 dark:border-gray-600 shadow-lg transform transition-all duration-700 ${isAnimated ? "rotate-0 scale-100" : "rotate-180 scale-0"}`}
              >
                <Sun className="w-8 h-8 text-yellow-500" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Weather<span className="text-blue-500">Pro</span>
                </h1>
                <p className="text-gray-700 dark:text-gray-300 text-sm lg:text-base font-medium">
                  Your Modern Weather Companion
                </p>
              </div>
            </div>

            <div
              className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-gray-300 dark:border-gray-600 shadow-lg transform transition-all duration-1000 delay-200 ${isAnimated ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="text-lg lg:text-xl font-semibold">{formatDate(currentTime)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-gray-900 dark:text-white mt-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-2xl lg:text-3xl font-mono font-light tracking-wider">
                  {formatTime(currentTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Theme and F/C Switch */}
          <div
            className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 transform transition-all duration-1000 delay-300 ${isAnimated ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            {/* Temperature Unit Toggle */}
            <div className="flex items-center gap-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-2 border border-gray-300 dark:border-gray-600 shadow-lg">
              <Button
                variant={!isCelsius ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsCelsius(false)}
                className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                  !isCelsius
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                °F
              </Button>
              <Button
                variant={isCelsius ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsCelsius(true)}
                className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                  isCelsius
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                °C
              </Button>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-gray-700 dark:text-gray-300 hover:bg-white/90 dark:hover:bg-gray-700/90 rounded-2xl p-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-300 dark:border-gray-600 shadow-lg transition-all duration-200"
            >
              {isDarkMode ? (
                <Sun size={24} className="text-yellow-500" />
              ) : (
                <Moon size={24} className="text-blue-500" />
              )}
            </Button>
          </div>
        </div>

        {/* IP Location Details */}
        <div
          className={`mb-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-4 border border-gray-300 dark:border-gray-600 shadow-lg transform transition-all duration-1000 ${isAnimated ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {locationStatus === "detecting" ? (
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              ) : locationStatus === "success" ? (
                <Globe className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-500" />
              )}
              <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">{getLocationStatusMessage()}</span>
            </div>
            {locationStatus !== "detecting" && (
              <Button
                onClick={refreshLocation}
                size="sm"
                disabled={locationStatus === "detecting"}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded-lg"
              >
                {locationStatus === "detecting" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh Location"}
              </Button>
            )}
          </div>

          {locationData && (
            <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700 dark:text-gray-300">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">IP:</span> {locationData.ip}
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">ISP:</span> {locationData.org}
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Timezone:</span> {locationData.timezone}
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Coordinates:</span>{" "}
                  {locationData.latitude?.toFixed(2)}, {locationData.longitude?.toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Section */}
        <Card
          className={`mb-8 lg:mb-12 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-gray-300 dark:border-gray-600 shadow-2xl rounded-3xl transform transition-all duration-1000 delay-400 ${isAnimated ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        >
          <CardContent className="p-6 lg:p-8">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  size={20}
                />
                <Input
                  placeholder="Search for cities worldwide (e.g., London, Tokyo, Paris)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 h-14 rounded-xl focus:bg-white dark:focus:bg-gray-600 transition-all duration-200 text-lg"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white h-14 px-8 rounded-xl transition-all duration-200 font-semibold"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                  <span className="ml-2 hidden sm:inline">Search</span>
                </Button>
                <Button
                  type="button"
                  onClick={refreshLocation}
                  disabled={isLoading || locationStatus === "detecting"}
                  className="bg-green-500 hover:bg-green-600 text-white h-14 px-8 rounded-xl transition-all duration-200 font-semibold"
                >
                  {locationStatus === "detecting" ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Navigation size={20} />
                  )}
                  <span className="ml-2 hidden sm:inline">{locationData ? "Update Location" : "Detect Location"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-900 dark:text-white text-xl font-semibold">Loading weather data...</p>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">{getLocationStatusMessage()}</p>
            </div>
          </div>
        ) : weatherData ? (
          <>
            {/* Weather and Hourly Forecast Side by Side */}
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-12">
              {/* Current Weather Section */}
              <Card
                className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-gray-300 dark:border-gray-600 shadow-2xl rounded-3xl overflow-hidden transform transition-all duration-1000 delay-500 ${isAnimated ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              >
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-4 text-gray-900 dark:text-white text-2xl lg:text-3xl">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-2xl">
                      <MapPin size={28} className="text-blue-500" />
                    </div>
                    <div>
                      <div className="font-bold">{weatherData.name}</div>
                      <div className="text-lg text-gray-600 dark:text-gray-400 font-normal">
                        {weatherData.sys.country}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`p-6 bg-gray-100 dark:bg-gray-700 rounded-3xl mb-6 transform transition-all duration-700 delay-600 ${isAnimated ? "rotate-0 scale-100" : "rotate-12 scale-0"}`}
                    >
                      <WeatherIcon icon={weatherData.weather[0].icon} size={80} />
                    </div>
                    <div
                      className={`text-6xl lg:text-7xl font-light text-gray-900 dark:text-white mb-2 transform transition-all duration-1000 delay-700 ${isAnimated ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
                    >
                      {convertTemp(weatherData.main.temp)}
                      <span className="text-3xl lg:text-4xl text-gray-600 dark:text-gray-400 ml-2">
                        {getTempUnit()}
                      </span>
                    </div>
                    <div className="text-xl lg:text-2xl text-gray-800 dark:text-gray-200 font-semibold mb-2 capitalize">
                      {weatherData.weather[0].description}
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 text-lg flex items-center gap-2">
                      <Thermometer size={18} />
                      Feels like {convertTemp(weatherData.main.feels_like)}
                      {getTempUnit()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        icon: Eye,
                        label: "Visibility",
                        value: `${Math.round(weatherData.visibility / 1000)} km`,
                        color: "text-blue-500",
                        bgColor: "bg-blue-100 dark:bg-blue-900/30",
                      },
                      {
                        icon: Droplets,
                        label: "Humidity",
                        value: `${weatherData.main.humidity}%`,
                        color: "text-cyan-500",
                        bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
                      },
                      {
                        icon: Wind,
                        label: "Wind",
                        value: (
                          <div className="flex items-center gap-2">
                            <span>{Math.round(weatherData.wind.speed * 3.6)} km/h</span>
                            <WindDirectionArrow degree={weatherData.wind.deg} />
                            <span className="text-xs">{getWindDirection(weatherData.wind.deg)}</span>
                          </div>
                        ),
                        color: "text-emerald-500",
                        bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
                      },
                      {
                        icon: Gauge,
                        label: "Pressure",
                        value: `${weatherData.main.pressure} hPa`,
                        color: "text-purple-500",
                        bgColor: "bg-purple-100 dark:bg-purple-900/30",
                      },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className={`${stat.bgColor} rounded-2xl p-4 transition-all duration-200 hover:scale-105 transform ${isAnimated ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
                        style={{ transitionDelay: `${800 + index * 100}ms` }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <stat.icon size={20} className={stat.color} />
                          <div className="text-gray-700 dark:text-gray-300 text-sm font-medium">{stat.label}</div>
                        </div>
                        <div className="text-gray-900 dark:text-white text-lg font-bold">{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-100 dark:bg-orange-900/30 rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Sunrise size={20} className="text-orange-500" />
                        <div className="text-gray-700 dark:text-gray-300 text-sm font-medium">Sunrise</div>
                      </div>
                      <div className="text-gray-900 dark:text-white text-lg font-bold">
                        {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    </div>
                    <div className="bg-pink-100 dark:bg-pink-900/30 rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Sunset size={20} className="text-pink-500" />
                        <div className="text-gray-700 dark:text-gray-300 text-sm font-medium">Sunset</div>
                      </div>
                      <div className="text-gray-900 dark:text-white text-lg font-bold">
                        {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hourly Forecast - Narrower Width */}
              <Card
                className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-gray-300 dark:border-gray-600 shadow-2xl rounded-3xl transform transition-all duration-1000 delay-600 ${isAnimated ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              >
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white text-xl lg:text-2xl flex items-center gap-3">
                    <Clock className="text-blue-500" size={24} />
                    Hourly Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="space-y-3 max-h-[600px] overflow-y-auto pr-2"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: isDarkMode ? "#4B5563 #374151" : "#D1D5DB #F3F4F6",
                    }}
                  >
                    <style jsx>{`
                      .space-y-3::-webkit-scrollbar {
                        width: 8px;
                      }
                      .space-y-3::-webkit-scrollbar-track {
                        background: ${isDarkMode ? "#374151" : "#F3F4F6"};
                        border-radius: 10px;
                      }
                      .space-y-3::-webkit-scrollbar-thumb {
                        background: ${isDarkMode ? "#4B5563" : "#D1D5DB"};
                        border-radius: 10px;
                      }
                      .space-y-3::-webkit-scrollbar-thumb:hover {
                        background: ${isDarkMode ? "#6B7280" : "#9CA3AF"};
                      }
                    `}</style>
                    {getHourlyForecast().map((hour, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-2xl p-3 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 transform ${isAnimated ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0"}`}
                        style={{ transitionDelay: `${1000 + index * 100}ms` }}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="text-gray-700 dark:text-gray-300 text-sm font-medium min-w-[50px]">
                            {hour.time}
                          </div>
                          <WeatherIcon icon={hour.icon} size={28} />
                          <div className="flex-1 min-w-0">
                            <div className="text-gray-900 dark:text-white font-semibold">
                              {convertTemp(hour.temp)}
                              {getTempUnit()}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 text-xs capitalize truncate">
                              {hour.description}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1 text-cyan-500">
                            <Umbrella size={12} />
                            {hour.precipitation}%
                          </div>
                          <div className="flex items-center gap-1 text-emerald-500">
                            <Wind size={12} />
                            <span>{hour.windSpeed}</span>
                            <WindDirectionArrow degree={hour.windDeg} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Daily Forecast Draggable Slider */}
            <Card
              className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-gray-300 dark:border-gray-600 shadow-2xl rounded-3xl transform transition-all duration-1000 delay-700 ${isAnimated ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white text-xl lg:text-2xl flex items-center gap-3">
                  <Calendar className="text-blue-500" size={24} />
                  7-Day Forecast
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-normal ml-2">(Drag to scroll)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  ref={dailySliderRef}
                  className="flex gap-4 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: isDarkMode ? "#4B5563 #374151" : "#D1D5DB #F3F4F6",
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      height: 8px;
                    }
                    div::-webkit-scrollbar-track {
                      background: ${isDarkMode ? "#374151" : "#F3F4F6"};
                      border-radius: 10px;
                    }
                    div::-webkit-scrollbar-thumb {
                      background: ${isDarkMode ? "#4B5563" : "#D1D5DB"};
                      border-radius: 10px;
                    }
                    div::-webkit-scrollbar-thumb:hover {
                      background: ${isDarkMode ? "#6B7280" : "#9CA3AF"};
                    }
                  `}</style>
                  {getDailyForecast().map((day, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-48 bg-gray-100 dark:bg-gray-700 rounded-2xl p-4 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 transform ${isAnimated ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
                      style={{ transitionDelay: `${1200 + index * 100}ms` }}
                    >
                      <div className="text-center">
                        <div className="text-gray-900 dark:text-white font-semibold text-base mb-1">{day.day}</div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm mb-3">{day.date}</div>
                        <div className="flex justify-center mb-3">
                          <WeatherIcon icon={day.icon} size={40} />
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 text-sm capitalize mb-3">
                          {day.description}
                        </div>
                        <div className="flex justify-center items-center gap-2 mb-3">
                          <span className="text-gray-900 dark:text-white font-bold text-lg">
                            {convertTemp(day.high)}
                            {getTempUnit()}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 text-base">
                            {convertTemp(day.low)}
                            {getTempUnit()}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-1 text-cyan-500 text-sm">
                            <Umbrella size={12} />
                            {day.precipitation}%
                          </div>
                          <div className="flex items-center justify-center gap-2 text-emerald-500 text-sm">
                            <Wind size={12} />
                            <span>{day.windSpeed} km/h</span>
                            <WindDirectionArrow degree={day.windDeg} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div
              className={`mt-12 lg:mt-16 text-center transform transition-all duration-1000 delay-1000 ${isAnimated ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
            >
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-6 border border-gray-300 dark:border-gray-600 shadow-lg">
                <p className="text-gray-800 dark:text-gray-200 text-sm lg:text-base">
                  WeatherPro - Your trusted weather companion with real-time forecasts and automatic location detection
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm mt-2">
                  Live data from OpenWeatherMap • IP-based location detection • 7-day outlook
                </p>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
