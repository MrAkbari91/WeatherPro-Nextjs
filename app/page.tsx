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
} from "lucide-react"

// Mock weather data for different locations
const weatherDatabase = {
  "New York, NY": {
    current: {
      location: "New York, NY",
      country: "United States",
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
      { time: "12 PM", temp: 72, icon: "partly-cloudy", precipitation: 10, windSpeed: 8 },
      { time: "1 PM", temp: 74, icon: "sunny", precipitation: 0, windSpeed: 7 },
      { time: "2 PM", temp: 76, icon: "sunny", precipitation: 0, windSpeed: 6 },
      { time: "3 PM", temp: 75, icon: "partly-cloudy", precipitation: 5, windSpeed: 8 },
      { time: "4 PM", temp: 73, icon: "cloudy", precipitation: 15, windSpeed: 9 },
      { time: "5 PM", temp: 71, icon: "cloudy", precipitation: 20, windSpeed: 10 },
      { time: "6 PM", temp: 69, icon: "partly-cloudy", precipitation: 10, windSpeed: 8 },
      { time: "7 PM", temp: 67, icon: "partly-cloudy", precipitation: 5, windSpeed: 7 },
    ],
    daily: [
      {
        day: "Today",
        date: "Dec 7",
        high: 76,
        low: 62,
        condition: "Partly Cloudy",
        icon: "partly-cloudy",
        precipitation: 20,
      },
      { day: "Tomorrow", date: "Dec 8", high: 78, low: 64, condition: "Sunny", icon: "sunny", precipitation: 0 },
      { day: "Wednesday", date: "Dec 9", high: 74, low: 60, condition: "Rainy", icon: "rainy", precipitation: 80 },
      { day: "Thursday", date: "Dec 10", high: 71, low: 58, condition: "Cloudy", icon: "cloudy", precipitation: 30 },
      {
        day: "Friday",
        date: "Dec 11",
        high: 73,
        low: 61,
        condition: "Partly Cloudy",
        icon: "partly-cloudy",
        precipitation: 10,
      },
      { day: "Saturday", date: "Dec 12", high: 75, low: 63, condition: "Sunny", icon: "sunny", precipitation: 0 },
      { day: "Sunday", date: "Dec 13", high: 77, low: 65, condition: "Sunny", icon: "sunny", precipitation: 5 },
    ],
  },
  London: {
    current: {
      location: "London",
      country: "United Kingdom",
      temperature: 45,
      condition: "Rainy",
      feelsLike: 42,
      humidity: 85,
      windSpeed: 12,
      pressure: 29.85,
      sunrise: "7:45 AM",
      sunset: "4:15 PM",
      icon: "rainy",
      uvIndex: 2,
      visibility: 6,
    },
    hourly: [
      { time: "12 PM", temp: 45, icon: "rainy", precipitation: 70, windSpeed: 12 },
      { time: "1 PM", temp: 46, icon: "rainy", precipitation: 80, windSpeed: 13 },
      { time: "2 PM", temp: 44, icon: "rainy", precipitation: 75, windSpeed: 11 },
      { time: "3 PM", temp: 43, icon: "cloudy", precipitation: 40, windSpeed: 10 },
      { time: "4 PM", temp: 42, icon: "cloudy", precipitation: 30, windSpeed: 9 },
      { time: "5 PM", temp: 41, icon: "partly-cloudy", precipitation: 20, windSpeed: 8 },
      { time: "6 PM", temp: 40, icon: "partly-cloudy", precipitation: 15, windSpeed: 7 },
      { time: "7 PM", temp: 39, icon: "cloudy", precipitation: 25, windSpeed: 8 },
    ],
    daily: [
      { day: "Today", date: "Dec 7", high: 46, low: 39, condition: "Rainy", icon: "rainy", precipitation: 75 },
      { day: "Tomorrow", date: "Dec 8", high: 48, low: 41, condition: "Cloudy", icon: "cloudy", precipitation: 40 },
      {
        day: "Wednesday",
        date: "Dec 9",
        high: 50,
        low: 43,
        condition: "Partly Cloudy",
        icon: "partly-cloudy",
        precipitation: 20,
      },
      { day: "Thursday", date: "Dec 10", high: 52, low: 45, condition: "Sunny", icon: "sunny", precipitation: 5 },
      { day: "Friday", date: "Dec 11", high: 49, low: 42, condition: "Cloudy", icon: "cloudy", precipitation: 35 },
      { day: "Saturday", date: "Dec 12", high: 47, low: 40, condition: "Rainy", icon: "rainy", precipitation: 65 },
      {
        day: "Sunday",
        date: "Dec 13",
        high: 51,
        low: 44,
        condition: "Partly Cloudy",
        icon: "partly-cloudy",
        precipitation: 25,
      },
    ],
  },
  "Current Location": {
    current: {
      location: "Current Location",
      country: "Auto-detected",
      temperature: 68,
      condition: "Sunny",
      feelsLike: 70,
      humidity: 55,
      windSpeed: 5,
      pressure: 30.25,
      sunrise: "6:45 AM",
      sunset: "7:30 PM",
      icon: "sunny",
      uvIndex: 8,
      visibility: 12,
    },
    hourly: [
      { time: "12 PM", temp: 68, icon: "sunny", precipitation: 0, windSpeed: 5 },
      { time: "1 PM", temp: 70, icon: "sunny", precipitation: 0, windSpeed: 6 },
      { time: "2 PM", temp: 72, icon: "sunny", precipitation: 0, windSpeed: 7 },
      { time: "3 PM", temp: 74, icon: "sunny", precipitation: 0, windSpeed: 8 },
      { time: "4 PM", temp: 73, icon: "partly-cloudy", precipitation: 5, windSpeed: 7 },
      { time: "5 PM", temp: 71, icon: "partly-cloudy", precipitation: 10, windSpeed: 6 },
      { time: "6 PM", temp: 69, icon: "partly-cloudy", precipitation: 5, windSpeed: 5 },
      { time: "7 PM", temp: 67, icon: "sunny", precipitation: 0, windSpeed: 4 },
    ],
    daily: [
      { day: "Today", date: "Dec 7", high: 74, low: 58, condition: "Sunny", icon: "sunny", precipitation: 5 },
      { day: "Tomorrow", date: "Dec 8", high: 76, low: 60, condition: "Sunny", icon: "sunny", precipitation: 0 },
      {
        day: "Wednesday",
        date: "Dec 9",
        high: 78,
        low: 62,
        condition: "Partly Cloudy",
        icon: "partly-cloudy",
        precipitation: 15,
      },
      { day: "Thursday", date: "Dec 10", high: 75, low: 59, condition: "Sunny", icon: "sunny", precipitation: 0 },
      {
        day: "Friday",
        date: "Dec 11",
        high: 73,
        low: 57,
        condition: "Partly Cloudy",
        icon: "partly-cloudy",
        precipitation: 20,
      },
      { day: "Saturday", date: "Dec 12", high: 71, low: 55, condition: "Cloudy", icon: "cloudy", precipitation: 40 },
      { day: "Sunday", date: "Dec 13", high: 69, low: 53, condition: "Rainy", icon: "rainy", precipitation: 70 },
    ],
  },
}

const WeatherIcon = ({ icon, size = 24, className = "" }) => {
  const iconMap = {
    sunny: { icon: Sun, color: "text-amber-400 dark:text-yellow-300" },
    "partly-cloudy": { icon: Cloud, color: "text-sky-400 dark:text-blue-300" },
    cloudy: { icon: Cloud, color: "text-slate-400 dark:text-gray-300" },
    rainy: { icon: CloudRain, color: "text-blue-500 dark:text-cyan-400" },
    snowy: { icon: CloudSnow, color: "text-blue-200 dark:text-slate-200" },
    stormy: { icon: Zap, color: "text-purple-500 dark:text-violet-400" },
  }

  const { icon: IconComponent, color } = iconMap[icon] || iconMap.sunny
  return <IconComponent size={size} className={`${color} ${className} drop-shadow-sm`} />
}

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState(weatherDatabase["New York, NY"])
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

    // Simulate API call delay
    setTimeout(() => {
      // Find matching location data
      const locationKey = Object.keys(weatherDatabase).find((key) =>
        key.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      if (locationKey) {
        setWeatherData(weatherDatabase[locationKey])
      } else {
        // Create new mock data for searched location
        setWeatherData({
          ...weatherDatabase["New York, NY"],
          current: {
            ...weatherDatabase["New York, NY"].current,
            location: searchQuery,
            country: "Unknown",
          },
        })
      }
      setIsLoading(false)
      setSearchQuery("")
    }, 1500)
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            setWeatherData(weatherDatabase["Current Location"])
            setIsLoading(false)
          }, 1500)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-700">
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 lg:mb-12 space-y-6 lg:space-y-0">
          {/* App Title & Time */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 dark:bg-white/10 backdrop-blur-md rounded-2xl border border-white/30 dark:border-white/20">
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
            <div className="bg-white/15 dark:bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/30 dark:border-white/20 shadow-xl">
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
                {isCelsius ? <ToggleRight size={24} className="text-green-400" /> : <ToggleLeft size={24} />}
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
        <Card className="mb-8 lg:mb-12 bg-white/15 dark:bg-white/5 backdrop-blur-xl border-white/30 dark:border-white/10 shadow-2xl">
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
                  onClick={getCurrentLocation}
                  disabled={isLoading}
                  className="bg-amber-500/80 dark:bg-amber-600/80 hover:bg-amber-500 dark:hover:bg-amber-600 text-white h-14 px-8 rounded-xl backdrop-blur-md transition-all duration-200 font-semibold"
                >
                  <Navigation size={20} />
                  <span className="ml-2 hidden sm:inline">My Location</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Current Weather - Main Card */}
          <div className="lg:col-span-2">
            <Card className="bg-white/15 dark:bg-white/5 backdrop-blur-xl border-white/30 dark:border-white/10 shadow-2xl overflow-hidden">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-4 text-white text-2xl lg:text-3xl">
                    <div className="p-3 bg-white/20 dark:bg-white/10 rounded-2xl">
                      <MapPin size={28} className="text-amber-400 dark:text-yellow-300" />
                    </div>
                    <div>
                      <div className="font-bold">{weatherData.current.location}</div>
                      <div className="text-lg text-white/70 dark:text-white/60 font-normal">
                        {weatherData.current.country}
                      </div>
                    </div>
                  </CardTitle>
                  {isLoading && (
                    <div className="flex items-center gap-2 text-white/80">
                      <Loader2 className="animate-spin" size={20} />
                      <span className="text-sm">Updating...</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-8 lg:space-y-10">
                {/* Main Weather Display */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
                  <div className="flex items-center gap-6 lg:gap-8">
                    <div className="p-6 lg:p-8 bg-white/20 dark:bg-white/10 rounded-3xl backdrop-blur-md border border-white/30 dark:border-white/20">
                      <WeatherIcon icon={weatherData.current.icon} size={80} />
                    </div>
                    <div className="text-center lg:text-left">
                      <div className="text-6xl lg:text-8xl font-light text-white mb-2 lg:mb-4">
                        {convertTemp(weatherData.current.temperature)}
                        <span className="text-3xl lg:text-4xl text-white/80 dark:text-white/70 ml-2">
                          {getTempUnit()}
                        </span>
                      </div>
                      <div className="text-xl lg:text-2xl text-white font-semibold mb-2">
                        {weatherData.current.condition}
                      </div>
                      <div className="text-white/80 dark:text-white/70 text-lg flex items-center gap-2">
                        <Thermometer size={18} />
                        Feels like {convertTemp(weatherData.current.feelsLike)}
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
                      value: `${weatherData.current.visibility} mi`,
                      color: "text-blue-400 dark:text-cyan-300",
                      bgColor: "bg-blue-500/20 dark:bg-cyan-500/20",
                    },
                    {
                      icon: Droplets,
                      label: "Humidity",
                      value: `${weatherData.current.humidity}%`,
                      color: "text-cyan-400 dark:text-blue-300",
                      bgColor: "bg-cyan-500/20 dark:bg-blue-500/20",
                    },
                    {
                      icon: Wind,
                      label: "Wind Speed",
                      value: `${weatherData.current.windSpeed} mph`,
                      color: "text-green-400 dark:text-emerald-300",
                      bgColor: "bg-green-500/20 dark:bg-emerald-500/20",
                    },
                    {
                      icon: Gauge,
                      label: "Pressure",
                      value: `${weatherData.current.pressure} in`,
                      color: "text-purple-400 dark:text-violet-300",
                      bgColor: "bg-purple-500/20 dark:bg-violet-500/20",
                    },
                    {
                      icon: Sunrise,
                      label: "Sunrise",
                      value: weatherData.current.sunrise,
                      color: "text-orange-400 dark:text-amber-300",
                      bgColor: "bg-orange-500/20 dark:bg-amber-500/20",
                    },
                    {
                      icon: Sunset,
                      label: "Sunset",
                      value: weatherData.current.sunset,
                      color: "text-pink-400 dark:text-rose-300",
                      bgColor: "bg-pink-500/20 dark:bg-rose-500/20",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className={`${stat.bgColor} rounded-2xl p-4 lg:p-6 backdrop-blur-md border border-white/20 dark:border-white/10 hover:scale-105 transition-all duration-200`}
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
            <Card className="bg-white/15 dark:bg-white/5 backdrop-blur-xl border-white/30 dark:border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-xl lg:text-2xl flex items-center gap-3">
                  <Calendar className="text-amber-400 dark:text-yellow-300" size={24} />
                  7-Day Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4">
                {weatherData.daily.map((day, index) => (
                  <div
                    key={index}
                    className="bg-white/10 dark:bg-white/5 rounded-2xl p-4 lg:p-5 backdrop-blur-md border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200 hover:scale-[1.02]"
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
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hourly Forecast */}
        <Card className="mt-8 lg:mt-12 bg-white/15 dark:bg-white/5 backdrop-blur-xl border-white/30 dark:border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl lg:text-2xl flex items-center gap-3">
              <Clock className="text-amber-400 dark:text-yellow-300" size={24} />
              Hourly Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {weatherData.hourly.map((hour, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center min-w-[120px] lg:min-w-[140px] bg-white/10 dark:bg-white/5 rounded-2xl p-4 lg:p-6 backdrop-blur-md border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200 hover:scale-105"
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
                    {hour.windSpeed} mph
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 lg:mt-16 text-center">
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-white/10">
            <p className="text-white/80 dark:text-white/70 text-sm lg:text-base">
              WeatherPro - Your trusted weather companion with accurate forecasts and beautiful visualizations
            </p>
            <p className="text-white/60 dark:text-white/50 text-xs lg:text-sm mt-2">
              Data updates automatically • Location-based forecasts • 7-day outlook
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
