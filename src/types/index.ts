// Database types
export interface User {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface MoodEntry {
  id: string
  user_id: string
  mood_score: number // 1-10
  mood_description: string
  notes?: string
  created_at: string
  tags: string[]
}

export interface Conversation {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
  metadata?: Record<string, any>
}

export interface WellnessContent {
  id: string
  title: string
  content: string
  category: 'mindfulness' | 'breathing' | 'prayer' | 'meditation' | 'emergency'
  tags: string[]
  embedding?: number[]
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  date: string
  mood_average: number
  activities_completed: number
  goals_met: number
  reflection_notes?: string
}

// AI Response types
export interface AIResponse {
  content: string
  emotion_detected?: string
  risk_level: 'low' | 'medium' | 'high' | 'crisis'
  suggested_actions?: string[]
  relevant_resources?: WellnessContent[]
}

// Component Props types
export interface MoodCardProps {
  mood: MoodEntry
  onEdit?: (mood: MoodEntry) => void
  onDelete?: (id: string) => void
}

export interface ChatMessageProps {
  message: Message
  isUser: boolean
}

export interface DashboardMetrics {
  averageMood: number
  moodTrend: number
  activitiesCompleted: number
  streakDays: number
}