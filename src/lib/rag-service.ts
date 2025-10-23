import { supabase } from '@/lib/supabase'

// Conditional OpenAI import - only if API key is available
let openai: any = null
if (process.env.OPENAI_API_KEY) {
  const OpenAI = require('openai')
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export interface SearchResult {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  similarity: number
}

/**
 * Generate embeddings for text using OpenAI (fallback to text search if no API key)
 */
export async function generateEmbedding(text: string): Promise<number[] | null> {
  try {
    if (!openai) {
      console.log('OpenAI not configured, using text search fallback')
      return null
    }
    
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    })
    
    return response.data[0].embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    return null
  }
}

/**
 * Search for relevant wellness content using semantic similarity or text search
 */
export async function searchWellnessContent(
  query: string,
  limit: number = 5,
  category?: string
): Promise<SearchResult[]> {
  try {
    // Try to generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query)
    
    let data, error
    
    if (queryEmbedding) {
      // Use semantic search if embeddings are available
      let rpcQuery = supabase.rpc('match_wellness_content', {
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: limit,
      })
      
      // Add category filter if specified
      if (category) {
        rpcQuery = rpcQuery.eq('category', category)
      }
      
      const result = await rpcQuery
      data = result.data
      error = result.error
    } else {
      // Fallback to text search
      console.log('Using text search fallback')
      let textQuery = supabase
        .from('wellness_content')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,tags.cs.{${query}}`)
        .limit(limit)
      
      if (category) {
        textQuery = textQuery.eq('category', category)
      }
      
      const result = await textQuery
      data = result.data
      error = result.error
    }
    
    if (error) {
      console.error('Supabase search error:', error)
      throw new Error('Failed to search wellness content')
    }
    
    return data?.map((item: any) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      category: item.category,
      tags: item.tags,
      similarity: item.similarity || 0.8, // Default similarity for text search
    })) || []
  } catch (error) {
    console.error('Search error:', error)
    // Return empty array instead of throwing to prevent build failure
    return []
  }
}

/**
 * Add new wellness content with embeddings (optional)
 */
export async function addWellnessContent(
  title: string,
  content: string,
  category: string,
  tags: string[]
): Promise<void> {
  try {
    // Generate embedding for the content if possible
    const embedding = await generateEmbedding(`${title} ${content}`)
    
    const { error } = await supabase
      .from('wellness_content')
      .insert([
        {
          title,
          content,
          category,
          tags,
          embedding: embedding || null, // Allow null embeddings
        },
      ])
    
    if (error) {
      console.error('Error adding wellness content:', error)
      throw new Error('Failed to add wellness content')
    }
  } catch (error) {
    console.error('Add content error:', error)
    throw new Error('Failed to add wellness content')
  }
}

/**
 * Get contextual recommendations based on mood and recent entries
 */
export async function getContextualRecommendations(
  moodScore: number,
  recentMoodDescription: string,
  userHistory?: string[]
): Promise<SearchResult[]> {
  try {
    let searchQuery = ''
    
    // Build search query based on mood score
    if (moodScore <= 3) {
      searchQuery = `crisis emergency support depression anxiety ${recentMoodDescription}`
    } else if (moodScore <= 5) {
      searchQuery = `anxiety stress support mindfulness breathing ${recentMoodDescription}`
    } else if (moodScore <= 7) {
      searchQuery = `mindfulness meditation prayer peace ${recentMoodDescription}`
    } else {
      searchQuery = `gratitude praise joy celebration ${recentMoodDescription}`
    }
    
    // Add user history context
    if (userHistory) {
      searchQuery += ` ${userHistory.join(' ')}`
    }
    
    return await searchWellnessContent(searchQuery, 3)
  } catch (error) {
    console.error('Error getting recommendations:', error)
    return []
  }
}