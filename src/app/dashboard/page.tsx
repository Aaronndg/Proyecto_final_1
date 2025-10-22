'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, TrendingUp, Calendar, Target, Heart } from 'lucide-react'
import Link from 'next/link'

interface MoodEntry {
  id: string
  mood_score: number
  mood_description: string
  created_at: string
  tags: string[]
}

interface DashboardStats {
  averageMood: number
  totalEntries: number
  streakDays: number
  moodTrend: number
}

export default function DashboardPage() {
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    averageMood: 0,
    totalEntries: 0,
    streakDays: 0,
    moodTrend: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      const data = await response.json()
      
      if (response.ok) {
        setRecentMoods(data.recentMoods || [])
        setStats(data.stats || {})
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMoodColor = (score: number) => {
    if (score <= 3) return 'text-red-500'
    if (score <= 5) return 'text-yellow-500'
    if (score <= 7) return 'text-green-400'
    return 'text-green-600'
  }

  const getMoodEmoji = (score: number) => {
    if (score <= 2) return '😢'
    if (score <= 4) return '😔'
    if (score <= 6) return '😐'
    if (score <= 8) return '😊'
    return '😄'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 text-serenia-500 mx-auto mb-4 animate-pulse" />
          <p className="text-serenity-600">Cargando tu progreso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/" className="mr-4">
            <ArrowLeft className="w-6 h-6 text-serenity-600 hover:text-serenity-800" />
          </Link>
          <h1 className="text-3xl font-bold text-serenia-800">Mi Progreso</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-serenity-600">Ánimo Promedio</p>
                <p className={`text-2xl font-bold ${getMoodColor(stats.averageMood)}`}>
                  {stats.averageMood.toFixed(1)}/10
                </p>
              </div>
              <Heart className={`w-8 h-8 ${getMoodColor(stats.averageMood)}`} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-serenity-600">Registros Total</p>
                <p className="text-2xl font-bold text-serenia-600">{stats.totalEntries}</p>
              </div>
              <Calendar className="w-8 h-8 text-serenia-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-serenity-600">Racha de Días</p>
                <p className="text-2xl font-bold text-serenia-600">{stats.streakDays}</p>
              </div>
              <Target className="w-8 h-8 text-serenia-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-serenity-600">Tendencia</p>
                <p className={`text-2xl font-bold ${stats.moodTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.moodTrend >= 0 ? '+' : ''}{stats.moodTrend.toFixed(1)}
                </p>
              </div>
              <TrendingUp className={`w-8 h-8 ${stats.moodTrend >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>

        {/* Recent Mood Entries */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-serenity-800 mb-6">
            Registros Recientes
          </h2>
          
          {recentMoods.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-serenity-300 mx-auto mb-4" />
              <p className="text-serenity-600">No hay registros aún</p>
              <Link 
                href="/mood" 
                className="inline-block mt-4 px-6 py-2 bg-serenia-600 text-white rounded-lg hover:bg-serenia-700 transition-colors"
              >
                Registrar mi primer estado de ánimo
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentMoods.map((mood) => (
                <div key={mood.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getMoodEmoji(mood.mood_score)}</span>
                      <div>
                        <p className={`font-semibold ${getMoodColor(mood.mood_score)}`}>
                          {mood.mood_score}/10
                        </p>
                        <p className="text-sm text-serenity-600">
                          {new Date(mood.created_at).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-serenity-700 mb-2">{mood.mood_description}</p>
                  {mood.tags && mood.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {mood.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-serenia-100 text-serenia-700 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Encouragement Section */}
        <div className="bg-gradient-to-r from-serenia-100 to-serenity-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-serenity-800 mb-3">
            Reflexión Diaria
          </h3>
          <blockquote className="text-serenity-700 italic mb-4">
            &ldquo;Cada día es una nueva oportunidad para crecer en fe y bienestar. 
            Recuerda que Dios está contigo en cada paso de tu camino.&rdquo;
          </blockquote>
          <div className="flex space-x-4">
            <Link 
              href="/mood"
              className="px-4 py-2 bg-serenia-600 text-white rounded-lg hover:bg-serenia-700 transition-colors"
            >
              Registrar Ánimo
            </Link>
            <Link 
              href="/chat"
              className="px-4 py-2 border border-serenia-600 text-serenia-600 rounded-lg hover:bg-serenia-50 transition-colors"
            >
              Conversar con SerenIA
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}