
-- Create a function to increment a counter field
CREATE OR REPLACE FUNCTION increment(row_id UUID)
RETURNS INTEGER
LANGUAGE SQL
AS $$
  UPDATE urls 
  SET clicks = clicks + 1 
  WHERE id = row_id 
  RETURNING clicks;
$$;
