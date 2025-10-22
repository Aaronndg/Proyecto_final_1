import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id') || 'demo-user'

    // Fetch recent mood entries
    const { data: recentMoods, error: moodsError } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (moodsError) {
      console.error('Error fetching moods:', moodsError)
      return NextResponse.json(
        { error: 'Failed to fetch mood data' },
        { status: 500 }
      )
    }

    // Calculate statistics
    const stats = calculateStats(recentMoods || [])

    return NextResponse.json({
      recentMoods: recentMoods || [],
      stats
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateStats(moods: any[]) {
  if (moods.length === 0) {
    return {
      averageMood: 0,
      totalEntries: 0,
      streakDays: 0,
      moodTrend: 0
    }
  }

  // Calculate average mood
  const averageMood = moods.reduce((sum, mood) => sum + mood.mood_score, 0) / moods.length

  // Calculate mood trend (comparing last 3 vs previous 3)
  let moodTrend = 0
  if (moods.length >= 6) {
    const recent3 = moods.slice(0, 3).reduce((sum, mood) => sum + mood.mood_score, 0) / 3
    const previous3 = moods.slice(3, 6).reduce((sum, mood) => sum + mood.mood_score, 0) / 3
    moodTrend = recent3 - previous3
  }

  // Calculate streak days (simplified - consecutive days with entries)
  const streakDays = calculateStreakDays(moods)

  return {
    averageMood,
    totalEntries: moods.length,
    streakDays,
    moodTrend
  }
}

function calculateStreakDays(moods: any[]): number {
  if (moods.length === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let streak = 0
  let currentDate = new Date(today)

  for (const mood of moods) {
    const moodDate = new Date(mood.created_at)
    moodDate.setHours(0, 0, 0, 0)

    if (moodDate.getTime() === currentDate.getTime()) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}