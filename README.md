# SerenIA - Asistente Emocional y de Bienestar

![SerenIA Banner](https://via.placeholder.com/800x200/0ea5e9/ffffff?text=SerenIA+-+Tu+Asistente+de+Bienestar+Emocional)

## 📋 Descripción del Proyecto

SerenIA es un asistente emocional y de bienestar que integra tecnologías modernas de IA para proporcionar apoyo empático basado en principios cristianos. La aplicación ayuda a los usuarios a gestionar su bienestar emocional mediante:

- **Registro de estados de ánimo** con análisis de patrones
- **Chat empático** con IA que brinda apoyo basado en principios cristianos
- **Sistema RAG** con contenido validado de bienestar y mindfulness
- **Dashboard de progreso** para visualizar el viaje de bienestar
- **Sistema de detección de riesgo** y recursos de ayuda profesional
- **Automatización** para recordatorios y seguimiento

## 🎯 Objetivo Académico

Este proyecto cumple con los requisitos del **Proyecto Final de Desarrollo Web**, demostrando la integración estratégica de:

1. ✅ **RAG y Base de Datos Vectoriales** - Búsqueda semántica en contenido de bienestar
2. ✅ **MCP con PostgreSQL** - Protocolo de contexto de modelo usando Supabase
3. ✅ **API de Inteligencia Artificial** - DeepSeek/OpenAI para respuestas empáticas
4. 🔄 **Automatización con n8n** - Flujos de trabajo para recordatorios y análisis
5. ✅ **Despliegue** - Preparado para Vercel con configuración completa

## 🚀 Tecnologías Implementadas

### Frontend
- **Next.js 15** con App Router
- **TypeScript** para tipado estático
- **Tailwind CSS** para diseño responsivo
- **Lucide React** para iconografía

### Backend & Base de Datos
- **Supabase** (PostgreSQL con pgvector)
- **API Routes** de Next.js
- **Row Level Security** (RLS)
- **Búsqueda vectorial** para RAG

### Inteligencia Artificial
- **DeepSeek API** / OpenAI para generación de texto
- **OpenAI Embeddings** para vectorización
- **Sistema RAG** personalizado
- **Detección de riesgo emocional**

### Automatización
- **n8n workflows** (configuración incluida)
- **Webhooks** para integración
- **Análisis de patrones** automatizado

## 📁 Estructura del Proyecto

```
serenia-app/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── api/               # API Routes
│   │   │   ├── chat/          # Endpoint de chat con IA
│   │   │   ├── dashboard/     # API de métricas
│   │   │   └── mood/          # API de estados de ánimo
│   │   ├── chat/              # Página de conversación
│   │   ├── dashboard/         # Dashboard de progreso
│   │   ├── mood/              # Registro de estado de ánimo
│   │   ├── globals.css        # Estilos globales
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Página de inicio
│   ├── lib/                   # Utilidades y servicios
│   │   ├── ai-service.ts      # Servicio de IA empática
│   │   ├── rag-service.ts     # Sistema RAG
│   │   └── supabase.ts        # Cliente de Supabase
│   └── types/                 # Definiciones TypeScript
│       └── index.ts           # Tipos principales
├── database/                  # Scripts de base de datos
│   ├── schema.sql            # Esquema completo
│   ├── functions.sql         # Funciones de búsqueda vectorial
│   └── seed-data.sql         # Datos de ejemplo
├── n8n/                      # Workflows de automatización
│   └── workflows/            # Flujos de n8n (próximamente)
└── docs/                     # Documentación adicional
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase
- API Key de DeepSeek o OpenAI
- Instancia de n8n (opcional)

### Instalación Local

1. **Clonar el repositorio**
   ```bash
   git clone [url-del-repositorio]
   cd serenia-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Completar las variables en `.env.local`:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
   SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
   
   # AI API Configuration
   DEEPSEEK_API_KEY=tu_api_key_deepseek
   # O alternativament
   OPENAI_API_KEY=tu_api_key_openai
   
   # N8N Configuration
   N8N_WEBHOOK_URL=tu_webhook_n8n
   ```

4. **Configurar la base de datos**
   - Ejecutar `database/schema.sql` en Supabase
   - Ejecutar `database/functions.sql` para búsqueda vectorial
   - Opcional: ejecutar `database/seed-data.sql` para datos de ejemplo

5. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

6. **Acceder a la aplicación**
   - Abrir http://localhost:3000

## 🗄️ Configuración de Base de Datos

### Supabase Setup

1. **Crear proyecto** en [supabase.com](https://supabase.com)
2. **Habilitar extensiones** necesarias:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "vector";
   ```
3. **Ejecutar scripts** en el siguiente orden:
   - `database/schema.sql`
   - `database/functions.sql`
   - `database/seed-data.sql` (opcional)

### Tablas Principales

- **users** - Información de usuarios
- **mood_entries** - Registros de estados de ánimo
- **conversations** - Conversaciones con el asistente
- **messages** - Mensajes individuales
- **wellness_content** - Contenido para RAG con embeddings
- **user_progress** - Métricas de progreso
- **emergency_resources** - Recursos de ayuda profesional

## 🤖 Sistema de Inteligencia Artificial

### RAG (Retrieval-Augmented Generation)

El sistema RAG busca contenido relevante en la base de datos vectorial:

1. **Vectorización** - Convierte texto a embeddings usando OpenAI
2. **Búsqueda semántica** - Encuentra contenido similar usando pgvector
3. **Generación contextual** - Usa el contenido encontrado para generar respuestas

### Detección de Riesgo

El sistema analiza automáticamente los mensajes para detectar:
- **Crisis** - Pensamientos suicidas o autolesión
- **Alto riesgo** - Desesperanza severa
- **Riesgo medio** - Ansiedad o depresión
- **Bajo riesgo** - Estados normales

### Principios Cristianos

Las respuestas de la IA están fundamentadas en:
- Amor incondicional de Dios
- Esperanza y propósito
- Importancia de la comunidad
- Integración fe-salud mental
- Recursos bíblicos apropiados

## 🔄 Automatización con n8n

### Flujos Implementados (Próximamente)

1. **Recordatorios diarios** - Invitaciones a registrar estado de ánimo
2. **Análisis de patrones** - Detección de tendencias preocupantes
3. **Alertas de seguimiento** - Notificaciones para usuarios en riesgo
4. **Reportes semanales** - Resúmenes de progreso

### Configuración n8n

1. Instalar n8n localmente o usar n8n.cloud
2. Importar workflows desde `n8n/workflows/`
3. Configurar webhooks en las variables de entorno
4. Conectar con Supabase y servicios de notificación

## 📊 Funcionalidades Principales

### 1. Registro de Estado de Ánimo
- Escala visual 1-10
- Descripción textual
- Etiquetas automáticas
- Análisis de patrones

### 2. Chat Empático
- Respuestas basadas en IA
- Contexto de contenido cristiano
- Detección automática de riesgo
- Sugerencias de acciones

### 3. Dashboard de Progreso
- Métricas de bienestar
- Tendencias temporales
- Racha de días activos
- Visualización de patrones

### 4. Sistema de Emergencia
- Detección automática de crisis
- Recursos de ayuda inmediata
- Contactos de emergencia
- Escalación apropiada

## 🚀 Despliegue

### Vercel (Recomendado)

1. **Conectar repositorio** en vercel.com
2. **Configurar variables de entorno** en el dashboard
3. **Desplegar automáticamente** con cada push

### Variables de Entorno para Producción

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DEEPSEEK_API_KEY=
N8N_WEBHOOK_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

## 🔒 Seguridad y Privacidad

- **Row Level Security** en todas las tablas
- **Validación de entrada** en todas las APIs
- **Encriptación** de datos sensibles
- **Anonimización** de métricas
- **Cumplimiento GDPR** (preparado)

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén implementados)
npm run test

# Verificar tipos de TypeScript
npm run type-check

# Linting
npm run lint
```

## 📈 Métricas y Monitoreo

- **Uso de la aplicación** - Páginas visitadas, tiempo de sesión
- **Efectividad del chat** - Satisfacción del usuario
- **Patrones de bienestar** - Tendencias de mejora
- **Detección de riesgo** - Precisión de alertas

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Equipo

- **Desarrollador Principal** - [Tu Nombre]
- **Asesor Espiritual** - [Nombre del Pastor/Consejero]
- **Validación Clínica** - [Profesional de Salud Mental]

## 📞 Contacto y Soporte

- **Email del Desarrollador** - tu-email@dominio.com
- **Documentación** - [Link a docs detalladas]
- **Issues** - [Link a GitHub Issues]

## 🙏 Agradecimientos

- Comunidad cristiana por la validación de contenido
- Profesionales de salud mental por la revisión clínica
- Beta testers por retroalimentación valiosa
- Profesores por la guía académica

---

## ⚠️ Nota Importante

**SerenIA es una herramienta de apoyo emocional y NO sustituye la atención profesional de salud mental. En casos de crisis o emergencia, siempre busca ayuda profesional inmediata.**

### Contactos de Emergencia
- **Servicios de Emergencia**: 911
- **Línea Nacional de Prevención del Suicidio**: 1-800-273-8255  
- **Crisis Text Line**: Envía "HOME" al 741741

---

*Desarrollado con ❤️ y fe para el bienestar de la comunidad*