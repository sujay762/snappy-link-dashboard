
// Validate a URL
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

// Format a URL for display (shorten if too long)
export const formatUrlForDisplay = (url: string, maxLength = 50): string => {
  if (url.length <= maxLength) return url;
  
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const path = urlObj.pathname;
    
    if (domain.length + 10 >= maxLength) {
      return domain.substring(0, maxLength - 3) + '...';
    }
    
    // Display domain + truncated path
    const availableChars = maxLength - domain.length - 6; // account for "..."
    return `${domain}${path.substring(0, availableChars)}...`;
  } catch (err) {
    // If not a valid URL, just truncate it
    return url.substring(0, maxLength - 3) + '...';
  }
};

// Format a date for display
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// List of common domain extensions for users to choose from
export const commonDomainExtensions = [
  { label: '.vercel.app', value: 'vercel.app' },
  { label: '.web.app', value: 'web.app' },
  { label: '.netlify.app', value: 'netlify.app' },
  { label: '.dev', value: 'dev' },
  { label: '.app', value: 'app' },
  { label: '.link', value: 'link' },
  // Default - use the current domain
  { label: '(current domain)', value: '' }
];

// Generate a full short URL with optional custom domain
export const getFullShortUrl = (shortCode: string, customDomain?: string): string => {
  // If custom domain is provided, use it, otherwise use the current domain
  if (customDomain) {
    // Make sure the domain starts with http:// or https://
    const protocol = window.location.protocol;
    // Remove any protocol if it exists in the custom domain
    const cleanDomain = customDomain.replace(/^https?:\/\//, '');
    return `${protocol}//${cleanDomain}/r/${shortCode}`;
  }
  return `${window.location.origin}/r/${shortCode}`;
};
