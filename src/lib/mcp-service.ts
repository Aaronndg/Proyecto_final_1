import { supabase } from './supabase'

/**
 * Model Context Protocol implementation for SerenIA
 * Provides structured context for AI models using PostgreSQL/Supabase
 */

export interface MCPContext {
  user_context: UserContext
  conversation_context: ConversationContext
  wellness_context: WellnessContext
  risk_context: RiskContext
}

export interface UserContext {
  user_id: string
  recent_moods: Array<{
    score: number
    description: string
    date: string
    tags: string[]
  }>
  mood_patterns: {
    average_score: number
    trend: 'improving' | 'stable' | 'declining'
    risk_indicators: string[]
  }
  preferences: {
    spiritual_focus: boolean
    preferred_resources: string[]
    communication_style: 'formal' | 'casual' | 'compassionate'
  }
}

export interface ConversationContext {
  conversation_id: string
  message_count: number
  topics_discussed: string[]
  emotional_journey: Array<{
    timestamp: string
    emotion: string
    intensity: number
  }>
  ai_observations: string[]
}

export interface WellnessContext {
  relevant_content: Array<{
    title: string
    content: string
    category: string
    relevance_score: number
  }>
  recommended_practices: string[]
  emergency_resources: Array<{
    name: string
    contact: string
    type: string
  }>
}

export interface RiskContext {
  current_risk_level: 'low' | 'medium' | 'high' | 'crisis'
  risk_factors: string[]
  protective_factors: string[]
  escalation_history: Array<{
    date: string
    previous_level: string
    current_level: string
    triggers: string[]
  }>
  intervention_needed: boolean
}

/**
 * Build comprehensive context for AI model
 */
export async function buildMCPContext(
  userId: string,
  conversationId?: string,
  currentMessage?: string
): Promise<MCPContext> {
  try {
    const [userContext, conversationContext, wellnessContext, riskContext] = await Promise.all([
      buildUserContext(userId),
      buildConversationContext(conversationId),
      buildWellnessContext(currentMessage),
      buildRiskContext(userId, currentMessage)
    ])

    return {
      user_context: userContext,
      conversation_context: conversationContext,
      wellness_context: wellnessContext,
      risk_context: riskContext
    }
  } catch (error) {
    console.error('Error building MCP context:', error)
    throw new Error('Failed to build context for AI model')
  }
}

/**
 * Build user-specific context from historical data
 */
async function buildUserContext(userId: string): Promise<UserContext> {
  // Get recent mood entries (last 30 days)
  const { data: recentMoods } = await supabase
    .from('mood_entries')
    .select('mood_score, mood_description, created_at, tags')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false })
    .limit(30)

  // Calculate mood patterns
  const moodScores = recentMoods?.map(m => m.mood_score) || []
  const averageScore = moodScores.length > 0 
    ? moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length 
    : 5

  // Determine trend
  let trend: 'improving' | 'stable' | 'declining' = 'stable'
  if (moodScores.length >= 7) {
    const recent7 = moodScores.slice(0, 7).reduce((sum, score) => sum + score, 0) / 7
    const previous7 = moodScores.slice(7, 14).reduce((sum, score) => sum + score, 0) / 7
    
    if (recent7 > previous7 + 0.5) trend = 'improving'
    else if (recent7 < previous7 - 0.5) trend = 'declining'
  }

  // Identify risk indicators
  const riskIndicators: string[] = []
  if (averageScore < 4) riskIndicators.push('low_mood_average')
  if (trend === 'declining') riskIndicators.push('declining_trend')
  
  const recentLowMoods = moodScores.slice(0, 7).filter(score => score <= 3).length
  if (recentLowMoods >= 3) riskIndicators.push('frequent_low_moods')

  return {
    user_id: userId,
    recent_moods: recentMoods?.map(mood => ({
      score: mood.mood_score,
      description: mood.mood_description,
      date: mood.created_at,
      tags: mood.tags || []
    })) || [],
    mood_patterns: {
      average_score: averageScore,
      trend,
      risk_indicators: riskIndicators
    },
    preferences: {
      spiritual_focus: true, // Default for SerenIA
      preferred_resources: ['prayer', 'scripture', 'mindfulness'],
      communication_style: 'compassionate'
    }
  }
}

/**
 * Build conversation-specific context
 */
async function buildConversationContext(conversationId?: string): Promise<ConversationContext> {
  if (!conversationId) {
    return {
      conversation_id: 'new',
      message_count: 0,
      topics_discussed: [],
      emotional_journey: [],
      ai_observations: []
    }
  }

  const { data: messages } = await supabase
    .from('messages')
    .select('role, content, created_at, metadata')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  const topics = extractTopics(messages || [])
  const emotionalJourney = extractEmotionalJourney(messages || [])
  const aiObservations = extractAIObservations(messages || [])

  return {
    conversation_id: conversationId,
    message_count: messages?.length || 0,
    topics_discussed: topics,
    emotional_journey: emotionalJourney,
    ai_observations: aiObservations
  }
}

/**
 * Build wellness content context using RAG
 */
async function buildWellnessContext(currentMessage?: string): Promise<WellnessContext> {
  let relevantContent: any[] = []
  
  if (currentMessage) {
    // Use RAG service to find relevant content
    try {
      const { searchWellnessContent } = await import('./rag-service')
      relevantContent = await searchWellnessContent(currentMessage, 5)
    } catch (error) {
      console.error('RAG search failed:', error)
    }
  }

  // Get emergency resources
  const { data: emergencyResources } = await supabase
    .from('emergency_resources')
    .select('name, phone, description, category')
    .eq('is_active', true)
    .order('category')

  return {
    relevant_content: relevantContent.map(content => ({
      title: content.title,
      content: content.content.substring(0, 500), // Truncate for context
      category: content.category,
      relevance_score: content.similarity || 0
    })),
    recommended_practices: [
      'daily_prayer',
      'scripture_meditation',
      'breathing_exercises',
      'gratitude_journaling'
    ],
    emergency_resources: emergencyResources?.map(resource => ({
      name: resource.name,
      contact: resource.phone,
      type: resource.category
    })) || []
  }
}

/**
 * Build risk assessment context
 */
async function buildRiskContext(userId: string, currentMessage?: string): Promise<RiskContext> {
  // Analyze current message for risk
  let currentRiskLevel: 'low' | 'medium' | 'high' | 'crisis' = 'low'
  const riskFactors: string[] = []
  const protectiveFactors: string[] = []

  if (currentMessage) {
    // Simple risk analysis for MCP context
    const messageText = currentMessage.toLowerCase()
    
    // Crisis indicators
    if (messageText.includes('suicid') || messageText.includes('matarme') || 
        messageText.includes('acabar con todo') || messageText.includes('no quiero vivir')) {
      currentRiskLevel = 'crisis'
    }
    // High risk indicators
    else if (messageText.includes('desesperado') || messageText.includes('sin esperanza') ||
             messageText.includes('no puedo más') || messageText.includes('todo está perdido')) {
      currentRiskLevel = 'high'
    }
    // Medium risk indicators
    else if (messageText.includes('deprimido') || messageText.includes('ansioso') ||
             messageText.includes('triste') || messageText.includes('preocupado')) {
      currentRiskLevel = 'medium'
    }
    
    // Identify specific risk factors
    if (messageText.includes('suicid') || messageText.includes('matarme')) {
      riskFactors.push('suicidal_ideation')
    }
    if (messageText.includes('solo') || messageText.includes('abandonado')) {
      riskFactors.push('social_isolation')
    }
    if (messageText.includes('desesperado') || messageText.includes('sin esperanza')) {
      riskFactors.push('hopelessness')
    }
    
    // Identify protective factors
    if (messageText.includes('dios') || messageText.includes('fe') || messageText.includes('orar')) {
      protectiveFactors.push('spiritual_connection')
    }
    if (messageText.includes('familia') || messageText.includes('amigos')) {
      protectiveFactors.push('social_support')
    }
  }

  // Get historical risk escalations
  const { data: automationLogs } = await supabase
    .from('automation_logs')
    .select('created_at, payload')
    .eq('user_id', userId)
    .eq('event_type', 'risk_escalation')
    .order('created_at', { ascending: false })
    .limit(10)

  const escalationHistory = automationLogs?.map(log => ({
    date: log.created_at,
    previous_level: log.payload?.previous_level || 'unknown',
    current_level: log.payload?.current_level || 'unknown',
    triggers: log.payload?.triggers || []
  })) || []

  return {
    current_risk_level: currentRiskLevel,
    risk_factors: riskFactors,
    protective_factors: protectiveFactors,
    escalation_history: escalationHistory,
    intervention_needed: currentRiskLevel === 'crisis' || currentRiskLevel === 'high'
  }
}

/**
 * Helper functions for context extraction
 */
function extractTopics(messages: any[]): string[] {
  const topics = new Set<string>()
  
  messages.forEach(message => {
    if (message.role === 'user') {
      const content = message.content.toLowerCase()
      
      // Common wellness topics
      if (content.includes('ansi') || content.includes('nervios')) topics.add('anxiety')
      if (content.includes('trist') || content.includes('deprim')) topics.add('sadness')
      if (content.includes('dios') || content.includes('fe')) topics.add('spirituality')
      if (content.includes('familia') || content.includes('relacion')) topics.add('relationships')
      if (content.includes('trabajo') || content.includes('estr')) topics.add('stress')
      if (content.includes('solo') || content.includes('aislad')) topics.add('loneliness')
    }
  })
  
  return Array.from(topics)
}

function extractEmotionalJourney(messages: any[]): Array<{timestamp: string, emotion: string, intensity: number}> {
  return messages
    .filter(msg => msg.role === 'user')
    .map(msg => ({
      timestamp: msg.created_at,
      emotion: detectPrimaryEmotion(msg.content),
      intensity: estimateEmotionalIntensity(msg.content)
    }))
}

function extractAIObservations(messages: any[]): string[] {
  return messages
    .filter(msg => msg.role === 'assistant' && msg.metadata?.observations)
    .map(msg => msg.metadata.observations)
    .flat()
}

function detectPrimaryEmotion(text: string): string {
  const emotionKeywords = {
    'sadness': ['triste', 'deprimido', 'melancólico', 'llorar'],
    'anxiety': ['ansioso', 'nervioso', 'preocupado', 'estresado'],
    'anger': ['enojado', 'furioso', 'molesto', 'irritado'],
    'fear': ['miedo', 'terror', 'pánico', 'asustado'],
    'joy': ['feliz', 'contento', 'alegre', 'gozoso'],
    'gratitude': ['agradecido', 'bendecido', 'reconocido'],
    'hope': ['esperanzado', 'optimista', 'confiado']
  }
  
  const lowerText = text.toLowerCase()
  
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return emotion
    }
  }
  
  return 'neutral'
}

function estimateEmotionalIntensity(text: string): number {
  const intensityMarkers = [
    'muy', 'extremadamente', 'completamente', 'totalmente',
    'demasiado', 'increíblemente', 'terriblemente'
  ]
  
  const lowerText = text.toLowerCase()
  let intensity = 5 // Base intensity
  
  // Increase intensity for markers
  intensityMarkers.forEach(marker => {
    if (lowerText.includes(marker)) intensity += 2
  })
  
  // Increase intensity for repetition and exclamation marks
  const exclamations = (text.match(/!/g) || []).length
  intensity += exclamations
  
  // Increase intensity for ALL CAPS
  if (text.toUpperCase() === text && text.length > 5) intensity += 3
  
  return Math.min(10, intensity)
}

/**
 * Store context snapshot for future reference
 */
export async function storeMCPSnapshot(
  userId: string,
  context: MCPContext,
  conversationId?: string
): Promise<void> {
  try {
    await supabase
      .from('automation_logs')
      .insert({
        user_id: userId,
        event_type: 'mcp_context_snapshot',
        payload: {
          conversation_id: conversationId,
          context_summary: {
            risk_level: context.risk_context.current_risk_level,
            mood_trend: context.user_context.mood_patterns.trend,
            topics: context.conversation_context.topics_discussed,
            intervention_needed: context.risk_context.intervention_needed
          },
          timestamp: new Date().toISOString()
        },
        status: 'completed'
      })
  } catch (error) {
    console.error('Error storing MCP snapshot:', error)
  }
}