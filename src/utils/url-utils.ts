
// Validate a URL
export const isValidUrl = (url: string): boolean => {
  try {
    // If URL doesn't have a protocol, add https:// to validate it properly
    const urlToCheck = /^https?:\/\//.test(url) ? url : `https://${url}`;
    new URL(urlToCheck);
    return true;
  } catch (err) {
    return false;
  }
};

// Format a URL for display (shorten if too long)
export const formatUrlForDisplay = (url: string, maxLength = 30): string => {
  if (url.length <= maxLength) return url;
  
  try {
    // If URL doesn't have a protocol, add https:// for parsing
    const urlToFormat = /^https?:\/\//.test(url) ? url : `https://${url}`;
    const urlObj = new URL(urlToFormat);
    const domain = urlObj.hostname;
    const path = urlObj.pathname;
    
    if (domain.length + 5 >= maxLength) {
      return domain.substring(0, maxLength - 3) + '...';
    }
    
    // Display domain + truncated path
    const availableChars = maxLength - domain.length - 4; // account for "..."
    return `${domain}${path.substring(0, availableChars > 0 ? availableChars : 0)}...`;
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
  { label: '.site', value: 'site' },
  { label: '.codes', value: 'codes' },
  { label: '.xyz', value: 'xyz' },
  // Default - use the current domain
  { label: '(current domain)', value: 'default' }
];

// Generate a full short URL with optional custom domain
export const getFullShortUrl = (shortCode: string, customDomain?: string): string => {
  // If custom domain is provided, use it, otherwise use the current domain
  if (customDomain && customDomain !== 'default') {
    // Make sure the domain starts with http:// or https://
    const protocol = window.location.protocol;
    // Remove any protocol if it exists in the custom domain
    const cleanDomain = customDomain.replace(/^https?:\/\//, '');
    return `${protocol}//${cleanDomain}/${shortCode}`;
  }
  
  // Using a shorter path format without the /r/ prefix
  return `${window.location.origin}/${shortCode}`;
};

// Helper function to ensure URLs have a protocol (for redirection)
export const ensureUrlHasProtocol = (url: string): string => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};
