
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";

// URL data interface
export interface UrlData {
  id: string;
  user_id: string;
  original_url: string;
  short_code: string;
  created_at: string;
  updated_at: string;
  clicks: number;
  title: string | null;
}

// Create a short URL
export const createShortUrl = async (
  userId: string,
  originalUrl: string,
  shortCode?: string
): Promise<UrlData> => {
  try {
    // If no custom short code is provided, generate a random one
    // Make it shorter (6 chars) for better usability
    const generatedShortCode = shortCode || generateShortCode(6);
    
    // Check if the short code already exists
    const { data: existingUrl } = await supabase
      .from('urls')
      .select('short_code')
      .eq('short_code', generatedShortCode)
      .single();
    
    if (existingUrl) {
      throw new Error("This custom URL is already taken. Please try another one.");
    }
    
    // Create the new short URL in the database
    const { data, error } = await supabase
      .from('urls')
      .insert([
        {
          id: uuidv4(),
          user_id: userId,
          original_url: originalUrl,
          short_code: generatedShortCode,
          clicks: 0
        }
      ])
      .select('*')
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create short URL");
  }
};

// Get all URLs for a user
export const getUserUrls = async (userId: string): Promise<UrlData[]> => {
  try {
    const { data, error } = await supabase
      .from('urls')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch URLs");
  }
};

// Update a URL
export const updateUrl = async (
  urlId: string,
  updates: {
    original_url?: string;
    short_code?: string;
    title?: string | null;
  }
): Promise<UrlData | null> => {
  try {
    // Check if the short code is being updated and already exists
    if (updates.short_code) {
      const { data: existingUrl } = await supabase
        .from('urls')
        .select('id, short_code')
        .eq('short_code', updates.short_code)
        .neq('id', urlId)
        .maybeSingle();
      
      if (existingUrl) {
        throw new Error("This custom URL is already taken. Please try another one.");
      }
    }
    
    const { data, error } = await supabase
      .from('urls')
      .update(updates)
      .eq('id', urlId)
      .select('*')
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update URL");
  }
};

// Delete a URL
export const deleteUrl = async (urlId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('urls')
      .delete()
      .eq('id', urlId);
    
    if (error) {
      throw new Error(error.message);
    }
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete URL");
  }
};

// Get URL by short code
export const getUrlByShortCode = async (shortCode: string): Promise<UrlData | null> => {
  try {
    const { data, error } = await supabase
      .from('urls')
      .select('*')
      .eq('short_code', shortCode)
      .maybeSingle();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching URL:", error);
    return null;
  }
};

// Increment URL clicks
export const incrementUrlClicks = async (urlId: string): Promise<number> => {
  try {
    // Call the RPC function to increment clicks and return the new count
    // Fix the type error by explicitly typing the return as number
    const { data, error } = await supabase.rpc('increment_url_clicks', {
      url_id: urlId
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Fix: Cast data to number to satisfy TypeScript
    return data as number;
  } catch (error) {
    console.error("Error incrementing clicks:", error);
    return 0;
  }
};

// Helper function to generate a random short code
const generateShortCode = (length: number = 6): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
