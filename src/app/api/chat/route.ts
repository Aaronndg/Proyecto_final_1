import { NextRequest, NextResponse } from 'next/server'
import { generateEmpatheticResponse } from '@/lib/ai-service'
import { searchWellnessContent } from '@/lib/rag-service'
import { buildMCPContext, storeMCPSnapshot } from '@/lib/mcp-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversationHistory, userId } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const user_id = userId || 'demo-user'
    const conversation_id = 'demo-conversation'

    // Build comprehensive context using MCP
    const mcpContext = await buildMCPContext(user_id, conversation_id, message)

    // Search for relevant wellness content using RAG
    const relevantResources = await searchWellnessContent(message, 3)

    // Extract mood context from MCP
    const moodContext = mcpContext.user_context.recent_moods.length > 0 
      ? {
          score: mcpContext.user_context.mood_patterns.average_score,
          description: mcpContext.user_context.recent_moods[0].description
        }
      : undefined

    // Generate AI response with enhanced context
    const aiResponse = await generateEmpatheticResponse(
      message,
      moodContext,
      relevantResources,
      conversationHistory
    )

    // Store MCP context snapshot for analytics
    await storeMCPSnapshot(user_id, mcpContext, conversation_id)

    // Enhanced response with MCP insights
    const enhancedResponse = {
      ...aiResponse,
      mcpInsights: {
        riskLevel: mcpContext.risk_context.current_risk_level,
        interventionNeeded: mcpContext.risk_context.intervention_needed,
        moodTrend: mcpContext.user_context.mood_patterns.trend,
        protectiveFactors: mcpContext.risk_context.protective_factors,
        recommendedActions: mcpContext.risk_context.intervention_needed 
          ? ['seek_immediate_help', 'contact_emergency_services']
          : ['continue_conversation', 'practice_mindfulness']
      }
    }

    return NextResponse.json(enhancedResponse)
  } catch (error) {
    console.error('Chat API error:', error)
    
    // Return a fallback response for critical errors
    return NextResponse.json({
      content: 'Lo siento, estoy teniendo dificultades técnicas en este momento. Si necesitas ayuda inmediata, por favor contacta a un profesional de la salud mental o llama a la línea de crisis: 1-800-273-8255.',
      riskLevel: 'medium',
      suggestedActions: [
        'Busca apoyo de un amigo o familiar',
        'Considera contactar a un profesional de la salud mental',
        'Practica técnicas de respiración profunda',
        'En caso de emergencia, llama al 911'
      ],
      mcpInsights: {
        riskLevel: 'medium',
        interventionNeeded: false,
        moodTrend: 'stable',
        protectiveFactors: [],
        recommendedActions: ['seek_support']
      }
    })
  }
}