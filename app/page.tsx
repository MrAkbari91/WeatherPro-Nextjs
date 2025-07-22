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
  Calendar,
  Clock,
  Thermometer,
  Umbrella,
  AlertCircle,
  MapPinOff,
} from "lucide-react"

const API_KEY = "ca799e241c694d886db7c9f33b5dbedd"

const WeatherIcon = ({ icon, size = 24, className = "" }) => {
  const iconMap = {
    "01d": { icon: Sun, color: "text-amber-400" },
    "01n": { icon: Moon, color: "text-slate-300" },
    "02d": { icon: Cloud, color: "text-sky-400" },
    "02n": { icon: Cloud, color: "text-slate-400" },
    "03d": { icon: Cloud, color: "text-gray-400" },
    "03n": { icon: Cloud, color: "text-gray-500" },
    "04d": { icon: Cloud, color: "text-gray-500" },
    "04n": { icon: Cloud, color: "text-gray-600" },
    "09d": { icon: CloudRain, color: "text-blue-500" },
    "09n": { icon: CloudRain, color: "text-blue-600" },
    "10d": { icon: CloudRain, color: "text-blue-400" },
    "10n": { icon: CloudRain, color: "text-blue-500" },
    "11d": { icon: Zap, color: "text-purple-500" },
    "11n": { icon: Zap, color: "text-purple-600" },
    "13d": { icon: CloudSnow, color: "text-blue-200" },
    "13n": { icon: CloudSnow, color: "text-slate-300" },
    "50d": { icon: Cloud, color: "text-gray-400" },
    "50n": { icon: Cloud, color: "text-gray-500" },
  }

  const { icon: IconComponent, color } = iconMap[icon] || iconMap["01d"]
  return <IconComponent size={size} className={`${color} ${className} drop-shadow-sm`} />
}

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isCelsius, setIsCelsius] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [error, setError] = useState(null)
  const [isAnimated, setIsAnimated] = useState(false)
  const [locationStatus, setLocationStatus] = useState("detecting") // detecting, granted, denied, unavailable

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

  // Initialize app with location detection
  useEffect(() => {
    initializeApp()
  }, [])

  // Trigger animations after data loads
  useEffect(() => {
    if (weatherData && !isAnimated) {
      setTimeout(() => setIsAnimated(true), 100)
    }
  }, [weatherData, isAnimated])

  const initializeApp = async () => {
    // First, try to get user's location
    if (navigator.geolocation) {
      setLocationStatus("detecting")

      // Check if geolocation permission is already granted
      if (navigator.permissions) {
        try {
          const permission = await navigator.permissions.query({ name: "geolocation" })

          if (permission.state === "granted") {
            getCurrentLocationSilently()
          } else if (permission.state === "denied") {
            setLocationStatus("denied")
            loadDefaultLocation()
          } else {
            // Permission is 'prompt' - try to get location
            getCurrentLocationWithPrompt()
          }
        } catch (error) {
          // Fallback if permissions API is not supported
          getCurrentLocationWithPrompt()
        }
      } else {
        // Fallback if permissions API is not supported
        getCurrentLocationWithPrompt()
      }
    } else {
      setLocationStatus("unavailable")
      loadDefaultLocation()
    }
  }

  const getCurrentLocationSilently = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationStatus("granted")
        fetchWeatherData(position.coords.latitude, position.coords.longitude)
      },
      (error) => {
        console.error("Silent location error:", error)
        setLocationStatus("denied")
        loadDefaultLocation()
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000,
      },
    )
  }

  const getCurrentLocationWithPrompt = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationStatus("granted")
        fetchWeatherData(position.coords.latitude, position.coords.longitude)
      },
      (error) => {
        console.error("Location error:", error)
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus("denied")
        } else {
          setLocationStatus("unavailable")
        }
        loadDefaultLocation()
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  const loadDefaultLocation = () => {
    // Load a popular city as default
    fetchWeatherByCity("New York")
  }

  const fetchWeatherData = async (lat, lon) => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
      )

      if (!weatherResponse.ok) {
        throw new Error("Weather data not available")
      }

      const weather = await weatherResponse.json()

      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
      )

      if (!forecastResponse.ok) {
        throw new Error("Forecast data not available")
      }

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

      // Fetch current weather by city
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`,
      )

      if (!weatherResponse.ok) {
        throw new Error("City not found")
      }

      const weather = await weatherResponse.json()

      // Fetch forecast using coordinates
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${weather.coord.lat}&lon=${weather.coord.lon}&appid=${API_KEY}&units=metric`,
      )

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

  const requestLocationAccess = () => {
    setLocationStatus("detecting")
    getCurrentLocationWithPrompt()
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

  const getAtmosphericBackground = () => {
    if (isDarkMode) {
      return "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    }

    if (!weatherData) {
      return "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600"
    }

    const weatherId = weatherData.weather[0].id
    const isDay = weatherData.weather[0].icon.includes("d")

    // Weather-based atmospheric backgrounds
    if (weatherId >= 200 && weatherId < 300) {
      // Thunderstorm
      return isDay
        ? "bg-gradient-to-br from-gray-700 via-purple-600 to-gray-800"
        : "bg-gradient-to-br from-gray-900 via-purple-900 to-black"
    } else if (weatherId >= 300 && weatherId < 600) {
      // Drizzle/Rain
      return isDay
        ? "bg-gradient-to-br from-gray-500 via-blue-600 to-gray-700"
        : "bg-gradient-to-br from-gray-800 via-blue-900 to-gray-900"
    } else if (weatherId >= 600 && weatherId < 700) {
      // Snow
      return isDay
        ? "bg-gradient-to-br from-blue-200 via-white to-blue-300"
        : "bg-gradient-to-br from-blue-900 via-slate-800 to-blue-900"
    } else if (weatherId >= 700 && weatherId < 800) {
      // Atmosphere (fog, mist, etc.)
      return isDay
        ? "bg-gradient-to-br from-gray-400 via-gray-300 to-gray-500"
        : "bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800"
    } else if (weatherId === 800) {
      // Clear sky
      return isDay
        ? "bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400"
        : "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
    } else {
      // Clouds
      return isDay
        ? "bg-gradient-to-br from-gray-400 via-blue-400 to-gray-600"
        : "bg-gradient-to-br from-gray-700 via-blue-800 to-gray-900"
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
      windSpeed: Math.round(item.wind.speed * 3.6), // Convert m/s to km/h
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
      }))
  }

  const getLocationStatusMessage = () => {
    switch (locationStatus) {
      case "detecting":
        return "Detecting your location..."
      case "denied":
        return "Location access denied - showing default location"
      case "unavailable":
        return "Location services unavailable - showing default location"
      case "granted":
        return "Using your current location"
      default:
        return ""
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 via-red-500 to-red-600 flex items-center justify-center p-4">
        <Card className="bg-white/20 backdrop-blur-xl border-white/30 shadow-2xl max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Weather Unavailable</h2>
            <p className="text-white/80 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-white/20 hover:bg-white/30 text-white border-white/40"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${getAtmosphericBackground()} transition-all duration-1000`}>
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        {/* Location Status Banner */}
        {locationStatus !== "granted" && (
          <div
            className={`mb-6 bg-white/15 dark:bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/30 dark:border-white/20 shadow-lg transform transition-all duration-1000 ${isAnimated ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPinOff className="w-5 h-5 text-amber-400" />
                <span className="text-white text-sm font-medium">{getLocationStatusMessage()}</span>
              </div>
              {locationStatus === "denied" && (
                <Button
                  onClick={requestLocationAccess}
                  size="sm"
                  className="bg-amber-500/80 hover:bg-amber-500 text-white text-xs px-4 py-2 rounded-lg"
                >
                  Enable Location
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Header Section */}
        <div
          className={`flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 lg:mb-12 space-y-6 lg:space-y-0 transform transition-all duration-1000 ${isAnimated ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          {/* App Title & Time */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div
                className={`p-3 bg-white/20 dark:bg-white/10 backdrop-blur-md rounded-2xl border border-white/30 dark:border-white/20 transform transition-all duration-700 ${isAnimated ? "rotate-0 scale-100" : "rotate-180 scale-0"}`}
              >
                <Sun className="w-8 h-8 text-amber-400 dark:text-yellow-300" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                  Weather<span className="text-amber-300 dark:text-yellow-300">Pro</span>
                </h1>
                <p className="text-white/80 dark:text-white/70 text-sm lg:text-base font-medium">
                  Your Modern Weather Companion
                </p>
              </div>
            </div>

            {/* Live Date & Time Display */}
            <div
              className={`bg-white/15 dark:bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/30 dark:border-white/20 shadow-xl transform transition-all duration-1000 delay-200 ${isAnimated ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-white">
                  <Calendar className="w-5 h-5 text-amber-300 dark:text-yellow-300" />
                  <span className="text-lg lg:text-xl font-semibold">{formatDate(currentTime)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-white mt-2">
                <Clock className="w-5 h-5 text-amber-300 dark:text-yellow-300" />
                <span className="text-2xl lg:text-3xl font-mono font-light tracking-wider">
                  {formatTime(currentTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div
            className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 transform transition-all duration-1000 delay-300 ${isAnimated ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            {/* Temperature Unit Toggle */}
            <div className="flex items-center gap-3 bg-white/15 dark:bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/30 dark:border-white/20 shadow-lg">
              <Thermometer className="w-5 h-5 text-amber-300 dark:text-yellow-300" />
              <span
                className={`text-sm font-semibold transition-all duration-200 ${!isCelsius ? "text-white scale-110" : "text-white/60"}`}
              >
                °F
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCelsius(!isCelsius)}
                className="p-2 text-white hover:bg-white/20 dark:hover:bg-white/10 rounded-xl transition-all duration-200"
              >
                {isCelsius ? <ToggleLeft size={24} /> : <ToggleRight size={24} className="text-green-400" />}
              </Button>
              <span
                className={`text-sm font-semibold transition-all duration-200 ${isCelsius ? "text-white scale-110" : "text-white/60"}`}
              >
                °C
              </span>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-white hover:bg-white/20 dark:hover:bg-white/10 rounded-2xl p-4 bg-white/15 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/20 shadow-lg transition-all duration-200"
            >
              {isDarkMode ? (
                <Sun size={24} className="text-amber-400" />
              ) : (
                <Moon size={24} className="text-slate-200" />
              )}
            </Button>
          </div>
        </div>

        {/* Search Section */}
        <Card
          className={`mb-8 lg:mb-12 bg-white/15 dark:bg-white/5 backdrop-blur-xl border-white/30 dark:border-white/10 shadow-2xl transform transition-all duration-1000 delay-400 ${isAnimated ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        >
          <CardContent className="p-6 lg:p-8">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 dark:text-white/50"
                  size={20}
                />
                <Input
                  placeholder="Search for cities worldwide (e.g., London, Tokyo, Paris)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-white/20 dark:bg-white/10 border-white/40 dark:border-white/20 text-white placeholder:text-white/60 dark:placeholder:text-white/50 h-14 rounded-xl focus:bg-white/30 dark:focus:bg-white/20 transition-all duration-200 text-lg"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 text-white border-white/40 dark:border-white/20 h-14 px-8 rounded-xl backdrop-blur-md transition-all duration-200 font-semibold"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                  <span className="ml-2 hidden sm:inline">Search</span>
                </Button>
                <Button
                  type="button"
                  onClick={requestLocationAccess}
                  disabled={isLoading || locationStatus === "detecting"}
                  className="bg-amber-500/80 dark:bg-amber-600/80 hover:bg-amber-500 dark:hover:bg-amber-600 text-white h-14 px-8 rounded-xl backdrop-blur-md transition-all duration-200 font-semibold"
                >
                  {locationStatus === "detecting" ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Navigation size={20} />
                  )}
                  <span className="ml-2 hidden sm:inline">
                    {locationStatus === "granted" ? "Update Location" : "My Location"}
                  </span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-white animate-spin mx-auto mb-4" />
              <p className="text-white text-xl font-semibold">Loading weather data...</p>
              <p className="text-white/70 text-sm mt-2">{getLocationStatusMessage()}</p>
            </div>
          </div>
        ) : weatherData ? (
          <>
            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Current Weather - Main Card */}
              <div className="lg:col-span-2">
                <Card
                  className={`bg-white/15 dark:bg-white/5 backdrop-blur-xl border-white/30 dark:border-white/10 shadow-2xl overflow-hidden transform transition-all duration-1000 delay-500 ${isAnimated ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                >
                  <CardHeader className="pb-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-4 text-white text-2xl lg:text-3xl">
                        <div className="p-3 bg-white/20 dark:bg-white/10 rounded-2xl">
                          <MapPin size={28} className="text-amber-400 dark:text-yellow-300" />
                        </div>
                        <div>
                          <div className="font-bold">{weatherData.name}</div>
                          <div className="text-lg text-white/70 dark:text-white/60 font-normal">
                            {weatherData.sys.country}
                          </div>
                        </div>
                      </CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-8 lg:space-y-10">
                    {/* Main Weather Display */}
                    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
                      <div className="flex items-center gap-6 lg:gap-8">
                        <div
                          className={`p-6 lg:p-8 bg-white/20 dark:bg-white/10 rounded-3xl backdrop-blur-md border border-white/30 dark:border-white/20 transform transition-all duration-700 delay-600 ${isAnimated ? "rotate-0 scale-100" : "rotate-12 scale-0"}`}
                        >
                          <WeatherIcon icon={weatherData.weather[0].icon} size={80} />
                        </div>
                        <div className="text-center lg:text-left">
                          <div
                            className={`text-6xl lg:text-8xl font-light text-white mb-2 lg:mb-4 transform transition-all duration-1000 delay-700 ${isAnimated ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
                          >
                            {convertTemp(weatherData.main.temp)}
                            <span className="text-3xl lg:text-4xl text-white/80 dark:text-white/70 ml-2">
                              {getTempUnit()}
                            </span>
                          </div>
                          <div className="text-xl lg:text-2xl text-white font-semibold mb-2 capitalize">
                            {weatherData.weather[0].description}
                          </div>
                          <div className="text-white/80 dark:text-white/70 text-lg flex items-center gap-2">
                            <Thermometer size={18} />
                            Feels like {convertTemp(weatherData.main.feels_like)}
                            {getTempUnit()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Weather Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                      {[
                        {
                          icon: Eye,
                          label: "Visibility",
                          value: `${Math.round(weatherData.visibility / 1000)} km`,
                          color: "text-blue-400 dark:text-cyan-300",
                          bgColor: "bg-blue-500/20 dark:bg-cyan-500/20",
                        },
                        {
                          icon: Droplets,
                          label: "Humidity",
                          value: `${weatherData.main.humidity}%`,
                          color: "text-cyan-400 dark:text-blue-300",
                          bgColor: "bg-cyan-500/20 dark:bg-blue-500/20",
                        },
                        {
                          icon: Wind,
                          label: "Wind Speed",
                          value: `${Math.round(weatherData.wind.speed * 3.6)} km/h`,
                          color: "text-green-400 dark:text-emerald-300",
                          bgColor: "bg-green-500/20 dark:bg-emerald-500/20",
                        },
                        {
                          icon: Gauge,
                          label: "Pressure",
                          value: `${weatherData.main.pressure} hPa`,
                          color: "text-purple-400 dark:text-violet-300",
                          bgColor: "bg-purple-500/20 dark:bg-violet-500/20",
                        },
                        {
                          icon: Sunrise,
                          label: "Sunrise",
                          value: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }),
                          color: "text-orange-400 dark:text-amber-300",
                          bgColor: "bg-orange-500/20 dark:bg-amber-500/20",
                        },
                        {
                          icon: Sunset,
                          label: "Sunset",
                          value: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }),
                          color: "text-pink-400 dark:text-rose-300",
                          bgColor: "bg-pink-500/20 dark:bg-rose-500/20",
                        },
                      ].map((stat, index) => (
                        <div
                          key={index}
                          className={`${stat.bgColor} rounded-2xl p-4 lg:p-6 backdrop-blur-md border border-white/20 dark:border-white/10 hover:scale-105 transition-all duration-200 transform ${isAnimated ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
                          style={{ transitionDelay: `${800 + index * 100}ms` }}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <stat.icon size={24} className={stat.color} />
                            <div className="text-white/70 dark:text-white/60 text-sm font-medium">{stat.label}</div>
                          </div>
                          <div className="text-white text-lg lg:text-xl font-bold">{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Daily Forecast */}
              <div>
                <Card
                  className={`bg-white/15 dark:bg-white/5 backdrop-blur-xl border-white/30 dark:border-white/10 shadow-2xl transform transition-all duration-1000 delay-600 ${isAnimated ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
                >
                  <CardHeader>
                    <CardTitle className="text-white text-xl lg:text-2xl flex items-center gap-3">
                      <Calendar className="text-amber-400 dark:text-yellow-300" size={24} />
                      7-Day Forecast
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[600px] overflow-y-auto scrollbar-hide">
                    <div className="space-y-3 lg:space-y-4">
                      {getDailyForecast().map((day, index) => (
                        <div
                          key={index}
                          className={`bg-white/10 dark:bg-white/5 rounded-2xl p-4 lg:p-5 backdrop-blur-md border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200 hover:scale-[1.02] transform ${isAnimated ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0"}`}
                          style={{ transitionDelay: `${1000 + index * 100}ms` }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <WeatherIcon icon={day.icon} size={36} />
                              <div>
                                <div className="text-white font-semibold text-lg">{day.day}</div>
                                <div className="text-white/70 dark:text-white/60 text-sm">{day.date}</div>
                                <div className="text-white/60 dark:text-white/50 text-sm">{day.condition}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-white font-bold text-xl">
                                  {convertTemp(day.high)}
                                  {getTempUnit()}
                                </span>
                                <span className="text-white/60 dark:text-white/50 text-lg">
                                  {convertTemp(day.low)}
                                  {getTempUnit()}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-cyan-400 dark:text-blue-300 text-sm">
                                <Umbrella size={14} />
                                {day.precipitation}%
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Hourly Forecast */}
            <Card
              className={`mt-8 lg:mt-12 bg-white/15 dark:bg-white/5 backdrop-blur-xl border-white/30 dark:border-white/10 shadow-2xl transform transition-all duration-1000 delay-800 ${isAnimated ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <CardHeader>
                <CardTitle className="text-white text-xl lg:text-2xl flex items-center gap-3">
                  <Clock className="text-amber-400 dark:text-yellow-300" size={24} />
                  Hourly Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 scrollbar-hide">
                  {getHourlyForecast().map((hour, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center min-w-[120px] lg:min-w-[140px] bg-white/10 dark:bg-white/5 rounded-2xl p-4 lg:p-6 backdrop-blur-md border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200 hover:scale-105 transform ${isAnimated ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
                      style={{ transitionDelay: `${1200 + index * 100}ms` }}
                    >
                      <div className="text-white/80 dark:text-white/70 text-sm font-semibold mb-3">{hour.time}</div>
                      <WeatherIcon icon={hour.icon} size={48} className="mb-4" />
                      <div className="text-white font-bold text-xl lg:text-2xl mb-3">
                        {convertTemp(hour.temp)}
                        {getTempUnit()}
                      </div>
                      <div className="flex items-center gap-1 text-cyan-400 dark:text-blue-300 text-sm">
                        <Umbrella size={12} />
                        {hour.precipitation}%
                      </div>
                      <div className="flex items-center gap-1 text-green-400 dark:text-emerald-300 text-sm mt-1">
                        <Wind size={12} />
                        {hour.windSpeed} km/h
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
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-white/10">
                <p className="text-white/80 dark:text-white/70 text-sm lg:text-base">
                  WeatherPro - Your trusted weather companion with real-time forecasts and beautiful visualizations
                </p>
                <p className="text-white/60 dark:text-white/50 text-xs lg:text-sm mt-2">
                  Live data from OpenWeatherMap • Location-based forecasts • 7-day outlook
                </p>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
