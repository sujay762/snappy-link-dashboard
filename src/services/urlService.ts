
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export interface UrlData {
  id: string;
  userId: string;
  originalUrl: string;
  shortCode: string;
  title?: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
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
  customShortCode?: string
): Promise<UrlData> => {
  // Use custom code or generate a random one
  const shortCode = customShortCode || generateShortCode();
  
  // Check if custom code is already in use
  if (customShortCode) {
    const { data: existingUrl } = await supabase
      .from('urls')
      .select('*')
      .eq('short_code', customShortCode)
      .single();
    
    if (existingUrl) {
      throw new Error('This custom short code is already in use');
    }
  }
  
  const newUrl = {
    user_id: userId,
    original_url: originalUrl,
    short_code: shortCode,
    clicks: 0
  };
  
  const { data, error } = await supabase
    .from('urls')
    .insert(newUrl)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  // Format the data to match our interface
  return {
    id: data.id,
    userId: data.user_id,
    originalUrl: data.original_url,
    shortCode: data.short_code,
    title: data.title || undefined,
    clicks: data.clicks,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

// Get all URLs for a specific user
export const getUserUrls = async (userId: string): Promise<UrlData[]> => {
  const { data, error } = await supabase
    .from('urls')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(error.message);
  }
  
  // Format the data to match our interface
  return (data || []).map(url => ({
    id: url.id,
    userId: url.user_id,
    originalUrl: url.original_url,
    shortCode: url.short_code,
    title: url.title || undefined,
    clicks: url.clicks,
    createdAt: url.created_at,
    updatedAt: url.updated_at
  }));
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
      // No rows found
      return null;
    }
    throw new Error(error.message);
  }
  
  return {
    id: data.id,
    userId: data.user_id,
    originalUrl: data.original_url,
    shortCode: data.short_code,
    title: data.title || undefined,
    clicks: data.clicks,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

// Update a URL's click count
export const incrementUrlClicks = async (id: string): Promise<UrlData | null> => {
  const { data, error } = await supabase
    .from('urls')
    .update({ clicks: supabase.rpc('increment', { row_id: id }) })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found
      return null;
    }
    throw new Error(error.message);
  }
  
  return {
    id: data.id,
    userId: data.user_id,
    originalUrl: data.original_url,
    shortCode: data.short_code,
    title: data.title || undefined,
    clicks: data.clicks,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

// Update a URL
export const updateUrl = async (
  id: string,
  updates: Partial<Pick<UrlData, 'originalUrl' | 'shortCode' | 'title'>>
): Promise<UrlData | null> => {
  // Check if trying to update to an existing short code
  if (updates.shortCode) {
    const { data: existingUrl } = await supabase
      .from('urls')
      .select('*')
      .eq('short_code', updates.shortCode)
      .neq('id', id)
      .single();
    
    if (existingUrl) {
      throw new Error('This custom short code is already in use');
    }
  }

  const updateData: any = {};
  if (updates.originalUrl) updateData.original_url = updates.originalUrl;
  if (updates.shortCode) updateData.short_code = updates.shortCode;
  if (updates.title !== undefined) updateData.title = updates.title;
  
  const { data, error } = await supabase
    .from('urls')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found
      return null;
    }
    throw new Error(error.message);
  }
  
  return {
    id: data.id,
    userId: data.user_id,
    originalUrl: data.original_url,
    shortCode: data.short_code,
    title: data.title || undefined,
    clicks: data.clicks,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

// Delete a URL
export const deleteUrl = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('urls')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return true;
};
