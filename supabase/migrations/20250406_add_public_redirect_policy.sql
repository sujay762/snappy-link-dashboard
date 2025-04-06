
-- Allow anyone to view URLs (needed for public redirects)
CREATE POLICY "Allow public URL access by short_code" 
ON public.urls FOR SELECT 
USING (true);
