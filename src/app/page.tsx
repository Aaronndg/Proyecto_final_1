import Link from 'next/link'
import { Heart, MessageCircle, BarChart3, Settings } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-serenia-800 mb-4">
            SerenIA
          </h1>
          <p className="text-xl text-serenity-600 max-w-2xl mx-auto">
            Tu asistente emocional y de bienestar, guiado por principios cristianos
          </p>
        </header>

        {/* Main Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Mood Check */}
          <Link href="/mood" className="group">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <Heart className="w-12 h-12 text-serenia-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-serenity-800 mb-2">
                Estado de Ánimo
              </h3>
              <p className="text-serenity-600">
                Registra cómo te sientes hoy y recibe apoyo personalizado
              </p>
            </div>
          </Link>

          {/* Chat */}
          <Link href="/chat" className="group">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <MessageCircle className="w-12 h-12 text-serenia-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-serenity-800 mb-2">
                Conversación
              </h3>
              <p className="text-serenity-600">
                Habla con SerenIA sobre tus pensamientos y emociones
              </p>
            </div>
          </Link>

          {/* Dashboard */}
          <Link href="/dashboard" className="group">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <BarChart3 className="w-12 h-12 text-serenia-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-serenity-800 mb-2">
                Mi Progreso
              </h3>
              <p className="text-serenity-600">
                Visualiza tu viaje hacia el bienestar emocional
              </p>
            </div>
          </Link>
        </div>

        {/* Emergency Section */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                ¿Necesitas ayuda inmediata?
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Si estás pasando por una crisis emocional, no estás solo. Busca ayuda profesional:
                </p>
                <ul className="list-disc list-inside mt-2">
                  <li>Línea Nacional de Prevención del Suicidio: 1-800-273-8255</li>
                  <li>Servicios de emergencia: 911</li>
                  <li>Crisis Text Line: Envía &ldquo;HOME&rdquo; al 741741</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}