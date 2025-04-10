
-- Create a function to safely increment the clicks counter
CREATE OR REPLACE FUNCTION increment(row_id UUID)
RETURNS INTEGER
LANGUAGE SQL
AS $$
  UPDATE public.urls
  SET clicks = clicks + 1
  WHERE id = row_id
  RETURNING clicks;
$$;
