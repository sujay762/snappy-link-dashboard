
import { v4 as uuidv4 } from 'uuid';

export interface UrlData {
  id: string;
  userId: string;
  originalUrl: string;
  shortCode: string;
  domain: string;
  clicks: number;
  createdAt: string;
  expiresAt?: string | null;
}

// Will be replaced with Supabase database calls
const STORAGE_KEY = 'snappy_urls';

// Helper to get URLs from localStorage
const getUrlsFromStorage = (): UrlData[] => {
  const storedUrls = localStorage.getItem(STORAGE_KEY);
  return storedUrls ? JSON.parse(storedUrls) : [];
};

// Helper to save URLs to localStorage
const saveUrlsToStorage = (urls: UrlData[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
};

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
  domain: string = 'short.ly',
  customShortCode?: string,
  expiresAt?: string
): Promise<UrlData> => {
  const urls = getUrlsFromStorage();
  
  // Use custom code or generate a random one
  const shortCode = customShortCode || generateShortCode();
  
  // Check if custom code is already in use
  if (customShortCode) {
    const exists = urls.some(url => url.shortCode === customShortCode);
    if (exists) {
      throw new Error('This custom short code is already in use');
    }
  }
  
  const newUrl: UrlData = {
    id: uuidv4(),
    userId,
    originalUrl,
    shortCode,
    domain,
    clicks: 0,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt || null
  };
  
  urls.push(newUrl);
  saveUrlsToStorage(urls);
  
  return newUrl;
};

// Get all URLs for a specific user
export const getUserUrls = async (userId: string): Promise<UrlData[]> => {
  const urls = getUrlsFromStorage();
  return urls.filter(url => url.userId === userId);
};

// Get a URL by its short code
export const getUrlByShortCode = async (shortCode: string): Promise<UrlData | null> => {
  const urls = getUrlsFromStorage();
  const url = urls.find(url => url.shortCode === shortCode);
  return url || null;
};

// Update a URL's click count
export const incrementUrlClicks = async (id: string): Promise<UrlData | null> => {
  const urls = getUrlsFromStorage();
  const urlIndex = urls.findIndex(url => url.id === id);
  
  if (urlIndex === -1) {
    return null;
  }
  
  urls[urlIndex].clicks += 1;
  saveUrlsToStorage(urls);
  
  return urls[urlIndex];
};

// Update a URL
export const updateUrl = async (
  id: string,
  updates: Partial<Pick<UrlData, 'originalUrl' | 'shortCode' | 'domain' | 'expiresAt'>>
): Promise<UrlData | null> => {
  const urls = getUrlsFromStorage();
  const urlIndex = urls.findIndex(url => url.id === id);
  
  if (urlIndex === -1) {
    return null;
  }
  
  // Check if trying to update to an existing short code
  if (updates.shortCode && updates.shortCode !== urls[urlIndex].shortCode) {
    const exists = urls.some(url => url.shortCode === updates.shortCode);
    if (exists) {
      throw new Error('This custom short code is already in use');
    }
  }
  
  urls[urlIndex] = {
    ...urls[urlIndex],
    ...updates
  };
  
  saveUrlsToStorage(urls);
  
  return urls[urlIndex];
};

// Delete a URL
export const deleteUrl = async (id: string): Promise<boolean> => {
  const urls = getUrlsFromStorage();
  const filteredUrls = urls.filter(url => url.id !== id);
  
  if (filteredUrls.length === urls.length) {
    return false; // URL with this ID not found
  }
  
  saveUrlsToStorage(filteredUrls);
  return true;
};
