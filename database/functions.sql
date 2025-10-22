-- Function for semantic similarity search using pgvector
CREATE OR REPLACE FUNCTION match_wellness_content(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  title text,
  content text,
  category text,
  tags text[],
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    wellness_content.id,
    wellness_content.title,
    wellness_content.content,
    wellness_content.category,
    wellness_content.tags,
    1 - (wellness_content.embedding <=> query_embedding) AS similarity
  FROM wellness_content
  WHERE 1 - (wellness_content.embedding <=> query_embedding) > match_threshold
  ORDER BY wellness_content.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;