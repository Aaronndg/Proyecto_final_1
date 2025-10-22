'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, ArrowLeft, Heart, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface ChatMessage {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
  riskLevel?: 'low' | 'medium' | 'high' | 'crisis'
  suggestedActions?: string[]
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      conversation_id: 'demo',
      role: 'assistant',
      content: `¡Hola! Soy SerenIA, tu asistente de bienestar emocional. Estoy aquí para escucharte y acompañarte en tu camino hacia el bienestar, siempre desde una perspectiva de amor y fe cristiana.

Puedes contarme cómo te sientes, qué te preocupa, o simplemente conversar conmigo. Todo lo que compartas será tratado con respeto y confidencialidad.

¿Cómo te sientes hoy?`,
      created_at: new Date().toISOString(),
    }
  ])
  
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      conversation_id: 'demo',
      role: 'user',
      content: inputMessage,
      created_at: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: messages.slice(-5), // Last 5 messages for context
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: ChatMessage = {
          id: Date.now().toString() + '_ai',
          conversation_id: 'demo',
          role: 'assistant',
          content: data.content,
          created_at: new Date().toISOString(),
          riskLevel: data.riskLevel,
          suggestedActions: data.suggestedActions,
        }

        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || 'Error al enviar mensaje')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '_error',
        conversation_id: 'demo',
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskLevelColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'crisis': return 'border-red-500 bg-red-50'
      case 'high': return 'border-orange-500 bg-orange-50'
      case 'medium': return 'border-yellow-500 bg-yellow-50'
      default: return 'border-green-500 bg-green-50'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex items-center">
        <Link href="/" className="mr-4">
          <ArrowLeft className="w-6 h-6 text-serenity-600 hover:text-serenity-800" />
        </Link>
        <div className="flex items-center">
          <Heart className="w-8 h-8 text-serenia-500 mr-3" />
          <div>
            <h1 className="text-xl font-bold text-serenia-800">SerenIA</h1>
            <p className="text-sm text-serenity-600">Tu asistente de bienestar emocional</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-serenia-500 text-white'
                  : `bg-white text-serenity-800 border-l-4 ${getRiskLevelColor(message.riskLevel)}`
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              
              {/* Risk Level Indicator */}
              {message.riskLevel && message.riskLevel !== 'low' && (
                <div className="mt-3 flex items-center text-sm">
                  <AlertTriangle className={`w-4 h-4 mr-2 ${
                    message.riskLevel === 'crisis' ? 'text-red-500' :
                    message.riskLevel === 'high' ? 'text-orange-500' : 'text-yellow-500'
                  }`} />
                  <span className="font-medium">
                    {message.riskLevel === 'crisis' && 'Nivel de crisis detectado'}
                    {message.riskLevel === 'high' && 'Necesita atención'}
                    {message.riskLevel === 'medium' && 'Requiere cuidado'}
                  </span>
                </div>
              )}

              {/* Suggested Actions */}
              {message.suggestedActions && message.suggestedActions.length > 0 && (
                <div className="mt-3 p-3 bg-serenity-50 rounded border">
                  <h4 className="font-medium text-serenity-800 mb-2">Sugerencias:</h4>
                  <ul className="text-sm text-serenity-700 space-y-1">
                    {message.suggestedActions.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={`text-xs mt-2 ${
                message.role === 'user' ? 'text-serenia-100' : 'text-serenity-500'
              }`}>
                {new Date(message.created_at).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-4 max-w-[80%] border-l-4 border-serenia-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-serenia-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-serenia-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-serenia-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-serenity-600 text-sm">SerenIA está pensando...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-serenia-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-3 bg-serenia-600 text-white rounded-lg hover:bg-serenia-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Emergency Notice */}
      <div className="bg-red-100 border-t border-red-200 p-3">
        <p className="text-red-800 text-xs text-center">
          <strong>Recuerda:</strong> En caso de emergencia, contacta inmediatamente al 911 o llama a la línea de crisis: 1-800-273-8255
        </p>
      </div>
    </div>
  )
}