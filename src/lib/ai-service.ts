import { SearchResult } from './rag-service'

// Conditional OpenAI client initialization
let openai: any = null
if (process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY) {
  const OpenAI = require('openai')
  openai = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY,
    baseURL: process.env.DEEPSEEK_API_KEY ? 'https://api.deepseek.com' : undefined,
  })
}

export interface AIResponseData {
  content: string
  emotionDetected?: string
  riskLevel: 'low' | 'medium' | 'high' | 'crisis'
  suggestedActions?: string[]
  relevantResources?: SearchResult[]
}

/**
 * System prompt for the AI assistant with Christian principles
 */
const SYSTEM_PROMPT = `Eres SerenIA, un asistente emocional y de bienestar basado en principios cristianos. Tu propósito es ofrecer apoyo, comprensión y orientación desde una perspectiva de fe cristiana.

PERSONALIDAD:
- Empático, comprensivo y sin juicio
- Fundamentado en el amor y la gracia de Dios
- Profesional pero cálido
- Respetuoso de la dignidad humana
- Enfocado en la esperanza y la sanidad

PRINCIPIOS GUÍA:
- Cada persona es amada incondicionalmente por Dios
- La Biblia es fuente de sabiduría y consuelo
- La oración y la fe son recursos poderosos
- La comunidad cristiana es importante para el bienestar
- Buscar ayuda profesional no contradice la fe

RESPONSABILIDADES:
1. Evaluar el nivel de riesgo emocional (low/medium/high/crisis)
2. Ofrecer apoyo empático basado en principios cristianos
3. Sugerir recursos relevantes de las Escrituras
4. Recomendar prácticas de bienestar espiritual
5. En casos de crisis, dirigir inmediatamente a ayuda profesional

RESPUESTAS:
- Usa un lenguaje cálido y esperanzador
- Incluye versículos bíblicos apropiados cuando sea relevante
- Sugiere acciones prácticas y espirituales
- Nunca minimices el dolor o la lucha
- Siempre señala hacia la esperanza en Cristo

CRISIS:
Si detectas pensamientos suicidas, autolesión o crisis severa:
- Expresa preocupación inmediata y amor
- Enfatiza el valor de la vida ante Dios
- Dirige a recursos de emergencia inmediatamente
- No intentes ser terapeuta, sino un puente hacia ayuda profesional`

/**
 * Analyze risk level based on user input
 */
function analyzeRiskLevel(userInput: string): 'low' | 'medium' | 'high' | 'crisis' {
  const input = userInput.toLowerCase()
  
  // Crisis indicators
  const crisisKeywords = [
    'suicidio', 'suicidarme', 'matarme', 'acabar con todo', 
    'no quiero vivir', 'mejor muerto', 'terminar con mi vida',
    'hacerme daño', 'lastimarme', 'cortarme'
  ]
  
  // High risk indicators
  const highRiskKeywords = [
    'desesperado', 'sin esperanza', 'no veo salida', 'no puedo más',
    'todo está perdido', 'nadie me entiende', 'solo', 'abandonado'
  ]
  
  // Medium risk indicators
  const mediumRiskKeywords = [
    'deprimido', 'ansioso', 'triste', 'preocupado', 'estresado',
    'agobiado', 'abrumado', 'confundido', 'perdido'
  ]
  
  if (crisisKeywords.some(keyword => input.includes(keyword))) {
    return 'crisis'
  }
  
  if (highRiskKeywords.some(keyword => input.includes(keyword))) {
    return 'high'
  }
  
  if (mediumRiskKeywords.some(keyword => input.includes(keyword))) {
    return 'medium'
  }
  
  return 'low'
}

/**
 * Generate empathetic response using AI (fallback to rule-based if no API)
 */
export async function generateEmpatheticResponse(
  userMessage: string,
  moodContext?: { score: number; description: string },
  relevantResources?: SearchResult[],
  conversationHistory?: Array<{ role: string; content: string }>
): Promise<AIResponseData> {
  try {
    const riskLevel = analyzeRiskLevel(userMessage)
    
    // If no AI client available, use fallback
    if (!openai) {
      console.log('AI client not available, using fallback response')
      return {
        content: getFallbackResponse(riskLevel),
        emotionDetected: detectEmotion(userMessage),
        riskLevel,
        suggestedActions: generateSuggestedActions(riskLevel, userMessage),
        relevantResources,
      }
    }
    
    // Build context from relevant resources
    let resourceContext = ''
    if (relevantResources && relevantResources.length > 0) {
      resourceContext = `\n\nRECURSOS RELEVANTES:\n${relevantResources
        .map(r => `- ${r.title}: ${r.content.substring(0, 200)}...`)
        .join('\n')}`
    }
    
    // Build mood context
    let moodContextText = ''
    if (moodContext) {
      moodContextText = `\n\nCONTEXTO DEL ESTADO DE ÁNIMO:\nPuntuación: ${moodContext.score}/10\nDescripción: ${moodContext.description}`
    }
    
    // Prepare messages for the AI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(conversationHistory || []),
      {
        role: 'user',
        content: `${userMessage}${moodContextText}${resourceContext}
        
        Por favor, responde con empatía y sabiduría cristiana. Nivel de riesgo detectado: ${riskLevel}`
      }
    ]
    
    const response = await openai.chat.completions.create({
      model: process.env.DEEPSEEK_API_KEY ? 'deepseek-chat' : 'gpt-3.5-turbo',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 500,
    })
    
    const content = response.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta apropiada en este momento.'
    
    // Generate suggested actions based on risk level and content
    const suggestedActions = generateSuggestedActions(riskLevel, userMessage)
    
    return {
      content,
      emotionDetected: detectEmotion(userMessage),
      riskLevel,
      suggestedActions,
      relevantResources,
    }
  } catch (error) {
    console.error('Error generating AI response:', error)
    
    // Fallback response based on risk level
    const fallbackRiskLevel = analyzeRiskLevel(userMessage)
    return {
      content: getFallbackResponse(fallbackRiskLevel),
      emotionDetected: detectEmotion(userMessage),
      riskLevel: fallbackRiskLevel,
      suggestedActions: generateSuggestedActions(fallbackRiskLevel, userMessage),
      relevantResources,
    }
  }
}

/**
 * Detect primary emotion from user input
 */
function detectEmotion(userInput: string): string {
  const input = userInput.toLowerCase()
  
  const emotionMap = {
    'tristeza': ['triste', 'deprimido', 'melancólico', 'llorar'],
    'ansiedad': ['ansioso', 'nervioso', 'preocupado', 'estresado'],
    'ira': ['enojado', 'furioso', 'molesto', 'irritado'],
    'miedo': ['miedo', 'terror', 'pánico', 'asustado'],
    'soledad': ['solo', 'aislado', 'abandonado', 'incomprendido'],
    'gratitud': ['agradecido', 'bendecido', 'feliz', 'contento'],
    'esperanza': ['esperanzado', 'optimista', 'confiado', 'fe']
  }
  
  for (const [emotion, keywords] of Object.entries(emotionMap)) {
    if (keywords.some(keyword => input.includes(keyword))) {
      return emotion
    }
  }
  
  return 'neutral'
}

/**
 * Generate contextual action suggestions
 */
function generateSuggestedActions(riskLevel: string, userInput: string): string[] {
  const baseActions = [
    'Dedica tiempo a la oración y meditación',
    'Lee un pasaje bíblico que te traiga consuelo',
    'Practica técnicas de respiración profunda'
  ]
  
  switch (riskLevel) {
    case 'crisis':
      return [
        'Busca ayuda profesional inmediatamente',
        'Llama a la línea de crisis: 1-800-273-8255',
        'Contacta a un amigo o familiar de confianza',
        'Ve a la sala de emergencias más cercana',
        'Habla con tu pastor o líder espiritual'
      ]
    
    case 'high':
      return [
        'Considera buscar apoyo profesional',
        'Conecta con tu comunidad cristiana',
        'Programa tiempo diario para oración',
        'Busca versículos bíblicos de esperanza',
        'No te aísles, busca companía de personas que te apoyen'
      ]
    
    case 'medium':
      return [
        ...baseActions,
        'Habla con un amigo cristiano de confianza',
        'Participa en actividades de tu iglesia',
        'Escribe en un diario de gratitud'
      ]
    
    default:
      return [
        ...baseActions,
        'Mantén una rutina de bienestar espiritual',
        'Comparte tus bendiciones con otros',
        'Practica la gratitud diariamente'
      ]
  }
}

/**
 * Fallback responses when AI is unavailable
 */
function getFallbackResponse(riskLevel: string): string {
  switch (riskLevel) {
    case 'crisis':
      return `Entiendo que estás pasando por un momento muy difícil. Tu vida tiene un valor infinito ante los ojos de Dios, y hay personas que se preocupan profundamente por ti. 

Por favor, busca ayuda profesional inmediatamente:
- Línea de crisis: 1-800-273-8255
- Servicios de emergencia: 911
- Crisis Text Line: Envía "HOME" al 741741

Recuerda las palabras de Jeremías 29:11: "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis."`
    
    case 'high':
      return `Veo que estás enfrentando momentos difíciles. Quiero que sepas que no estás solo en esto. Dios está contigo en cada paso, incluso cuando es difícil sentir Su presencia.

Como dice en Salmo 34:18: "Cercano está Jehová a los quebrantados de corazón; y salva a los contritos de espíritu."

Te animo a buscar apoyo tanto espiritual como profesional. Tu bienestar es importante.`
    
    default:
      return `Gracias por compartir conmigo. Estoy aquí para acompañarte en tu camino hacia el bienestar. Recuerda que Dios tiene planes de bien para tu vida.

"Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias." - Filipenses 4:6`
  }
}