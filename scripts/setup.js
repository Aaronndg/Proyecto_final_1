#!/usr/bin/env node

/**
 * SerenIA Project Setup Script
 * Initializes the project with proper configuration for development
 */

const fs = require('fs')
const path = require('path')

console.log('🌟 Configurando SerenIA - Asistente Emocional y de Bienestar')
console.log('================================================\n')

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')

if (!fs.existsSync(envPath)) {
  console.log('📝 Creando archivo .env.local...')
  
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# AI API Configuration
DEEPSEEK_API_KEY=your_deepseek_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# N8N Configuration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook

# App Configuration
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000`

  fs.writeFileSync(envPath, envContent)
  console.log('✅ Archivo .env.local creado')
} else {
  console.log('✅ Archivo .env.local ya existe')
}

console.log('\n🚀 Próximos pasos para completar la configuración:')
console.log('================================================')

console.log('\n1. 🗄️  Configurar Supabase:')
console.log('   - Crear proyecto en https://supabase.com')
console.log('   - Ejecutar database/schema.sql en el editor SQL')
console.log('   - Ejecutar database/functions.sql para búsqueda vectorial')
console.log('   - Opcional: ejecutar database/seed-data.sql para datos de ejemplo')
console.log('   - Actualizar .env.local con las credenciales reales')

console.log('\n2. 🤖 Configurar API de IA:')
console.log('   - Obtener API key de DeepSeek (https://platform.deepseek.com)')
console.log('   - O usar OpenAI API key (https://platform.openai.com)')
console.log('   - Actualizar .env.local con la clave correspondiente')

console.log('\n3. 🔄 Configurar n8n (Opcional):')
console.log('   - Instalar n8n: npm install -g n8n')
console.log('   - Iniciar n8n: n8n start')
console.log('   - Importar workflows desde n8n/workflows/')
console.log('   - Configurar webhooks en .env.local')

console.log('\n4. 🏃‍♂️ Ejecutar el proyecto:')
console.log('   - npm run dev')
console.log('   - Abrir http://localhost:3000')

console.log('\n5. 🚀 Desplegar en producción:')
console.log('   - Conectar repositorio a Vercel')
console.log('   - Configurar variables de entorno en Vercel')
console.log('   - Deploy automático con cada push')

console.log('\n📚 Funcionalidades implementadas:')
console.log('================================================')
console.log('✅ Frontend completo con Next.js 15 + TypeScript')
console.log('✅ Sistema RAG con búsqueda semántica vectorial')
console.log('✅ Base de datos PostgreSQL con Supabase')
console.log('✅ API de IA para respuestas empáticas')
console.log('✅ Model Context Protocol (MCP) implementado')
console.log('✅ Sistema de detección de riesgo emocional')
console.log('✅ Dashboard de progreso y métricas')
console.log('✅ Contenido cristiano de bienestar integrado')
console.log('✅ Workflows de n8n para automatización')
console.log('✅ Configuración completa para despliegue')

console.log('\n📱 Páginas disponibles:')
console.log('- / (Inicio)')
console.log('- /mood (Registro de estado de ánimo)')
console.log('- /chat (Conversación con SerenIA)')
console.log('- /dashboard (Progreso y métricas)')

console.log('\n🔧 APIs implementadas:')
console.log('- /api/mood (POST/GET - Estados de ánimo)')
console.log('- /api/chat (POST - Conversación con IA)')
console.log('- /api/dashboard (GET - Métricas y progreso)')

console.log('\n⚠️  Nota importante:')
console.log('Este proyecto es para fines educativos y de demostración.')
console.log('Para uso en producción con usuarios reales, se requiere:')
console.log('- Revisión clínica profesional')
console.log('- Cumplimiento de regulaciones de salud mental')
console.log('- Certificaciones de seguridad y privacidad')

console.log('\n🎯 ¡Proyecto listo para demostración!')
console.log('Desarrollado para el Proyecto Final de Desarrollo Web')
console.log('Integrando RAG, MCP, PostgreSQL, IA, y n8n exitosamente ✨')