
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export interface UrlData {
  id: string;
  user_id: string;
  original_url: string;
  short_code: string;
  title: string | null;
  clicks: number;
  created_at: string;
  updated_at: string;
}

// Generate a random short code
const generateShortCode = (length = 6): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Create a new short URL
export const createShortUrl = async (
  userId: string,
  originalUrl: string,
  shortCode?: string,
  title?: string
): Promise<UrlData> => {
  const finalShortCode = shortCode || generateShortCode();
  
  // Check if custom code is already in use
  if (shortCode) {
    const { data: existingUrl } = await supabase
      .from('urls')
      .select('*')
      .eq('short_code', shortCode)
      .single();
      
    if (existingUrl) {
      throw new Error('This custom short code is already in use');
    }
  }
  
  const { data, error } = await supabase
    .from('urls')
    .insert({
      user_id: userId,
      original_url: originalUrl,
      short_code: finalShortCode,
      title: title || null,
      clicks: 0
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating URL:', error);
    throw new Error(error.message);
  }
  
  return data as UrlData;
};

// Get all URLs for a specific user
export const getUserUrls = async (userId: string): Promise<UrlData[]> => {
  const { data, error } = await supabase
    .from('urls')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching URLs:', error);
    throw new Error(error.message);
  }
  
  return data as UrlData[];
};

// Get a URL by its short code
export const getUrlByShortCode = async (shortCode: string): Promise<UrlData | null> => {
  const { data, error } = await supabase
    .from('urls')
    .select('*')
    .eq('short_code', shortCode)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // Code for "No rows returned" error
      return null;
    }
    console.error('Error fetching URL:', error);
    throw new Error(error.message);
  }
  
  return data as UrlData;
};

// Update a URL's click count
export const incrementUrlClicks = async (id: string): Promise<UrlData | null> => {
  try {
    const { error } = await supabase
      .rpc('increment', { row_id: id });
    
    if (error) {
      console.error('Error updating URL clicks:', error);
      throw new Error(error.message);
    }
    
    // Fetch the updated URL
    const { data: updatedUrl, error: fetchError } = await supabase
      .from('urls')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching updated URL:', fetchError);
      throw new Error(fetchError.message);
    }
    
    return updatedUrl as UrlData;
  } catch (error) {
    console.error('Error in incrementUrlClicks:', error);
    throw error;
  }
};

// Update a URL
export const updateUrl = async (
  id: string,
  updates: Partial<Pick<UrlData, 'original_url' | 'short_code' | 'title'>>
): Promise<UrlData | null> => {
  // Check if trying to update to an existing short code
  if (updates.short_code) {
    const { data: existingUrl } = await supabase
      .from('urls')
      .select('*')
      .eq('short_code', updates.short_code)
      .neq('id', id) // Exclude the current URL
      .single();
    
    if (existingUrl) {
      throw new Error('This custom short code is already in use');
    }
  }
  
  const { data, error } = await supabase
    .from('urls')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating URL:', error);
    throw new Error(error.message);
  }
  
  return data as UrlData;
};

// Delete a URL
export const deleteUrl = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('urls')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting URL:', error);
    throw new Error(error.message);
  }
  
  return true;
};
