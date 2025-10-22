'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Smile, Meh, Frown, Heart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const moodOptions = [
  { value: 1, label: 'Muy mal', icon: Frown, color: 'text-red-500' },
  { value: 2, label: 'Mal', icon: Frown, color: 'text-red-400' },
  { value: 3, label: 'Un poco mal', icon: Meh, color: 'text-orange-400' },
  { value: 4, label: 'Regular', icon: Meh, color: 'text-yellow-400' },
  { value: 5, label: 'Neutral', icon: Meh, color: 'text-gray-400' },
  { value: 6, label: 'Bien', icon: Smile, color: 'text-green-400' },
  { value: 7, label: 'Muy bien', icon: Smile, color: 'text-green-500' },
  { value: 8, label: 'Genial', icon: Smile, color: 'text-green-600' },
  { value: 9, label: 'Excelente', icon: Heart, color: 'text-green-700' },
  { value: 10, label: 'Increíble', icon: Heart, color: 'text-green-800' }
]

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMood) return

    setIsSubmitting(true)
    
    try {
      // TODO: Implement API call to save mood
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood_score: selectedMood,
          mood_description: description,
          notes: notes,
        }),
      })

      if (response.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error saving mood:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedMoodData = moodOptions.find(m => m.value === selectedMood)

  return (
    <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/" className="mr-4">
            <ArrowLeft className="w-6 h-6 text-serenity-600 hover:text-serenity-800" />
          </Link>
          <h1 className="text-3xl font-bold text-serenia-800">
            ¿Cómo te sientes hoy?
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Mood Selection */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-serenity-800 mb-6">
              Selecciona tu estado de ánimo
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {moodOptions.map((mood) => {
                const Icon = mood.icon
                return (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => setSelectedMood(mood.value)}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      selectedMood === mood.value
                        ? 'border-serenia-500 bg-serenia-50'
                        : 'border-gray-200 hover:border-serenia-300'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${mood.color}`} />
                    <div className="text-sm font-medium text-serenity-700">
                      {mood.value}
                    </div>
                    <div className="text-xs text-serenity-500">
                      {mood.label}
                    </div>
                  </button>
                )
              })}
            </div>

            {selectedMoodData && (
              <div className="mt-6 p-4 bg-serenia-50 rounded-lg">
                <div className="flex items-center justify-center">
                  <selectedMoodData.icon className={`w-6 h-6 mr-2 ${selectedMoodData.color}`} />
                  <span className="text-lg font-medium text-serenity-800">
                    {selectedMoodData.label} ({selectedMoodData.value}/10)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {selectedMood && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <label className="block text-xl font-semibold text-serenity-800 mb-4">
                Describe brevemente cómo te sientes
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Ansioso por el trabajo, feliz por el tiempo en familia..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-serenia-500 focus:border-transparent"
                required
              />
            </div>
          )}

          {/* Notes */}
          {selectedMood && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <label className="block text-xl font-semibold text-serenity-800 mb-4">
                Notas adicionales (opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="¿Hay algo específico que haya influido en tu estado de ánimo hoy?"
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-serenia-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Submit Button */}
          {selectedMood && description && (
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-serenia-600 text-white rounded-lg font-semibold hover:bg-serenia-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Guardando...' : 'Registrar Estado de Ánimo'}
              </button>
            </div>
          )}
        </form>

        {/* Inspirational Quote */}
        <div className="mt-12 bg-gradient-to-r from-serenia-100 to-serenity-100 rounded-lg p-6">
          <blockquote className="text-center">
            <p className="text-lg text-serenity-700 italic mb-4">
              &ldquo;Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios 
              en toda oración y ruego, con acción de gracias.&rdquo;
            </p>
            <cite className="text-sm text-serenity-600 font-medium">
              Filipenses 4:6
            </cite>
          </blockquote>
        </div>
      </div>
    </div>
  )
}