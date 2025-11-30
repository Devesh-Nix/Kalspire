import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str;
}

// Convert Google Drive sharing link to direct image URL
export function convertGoogleDriveUrl(url: string): string {
  if (!url) return url;
  
  // Check if it's a Google Drive link with various patterns
  // Pattern 1: /file/d/FILE_ID/view
  // Pattern 2: /file/d/FILE_ID/view?usp=...
  const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  
  if (match && match[1]) {
    // Convert to direct image URL
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  
  // Check if already in uc format
  const ucRegex = /drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/;
  const ucMatch = url.match(ucRegex);
  
  if (ucMatch && ucMatch[1]) {
    // Already in correct format
    return `https://drive.google.com/uc?export=view&id=${ucMatch[1]}`;
  }
  
  // Return original URL if not a Google Drive link
  return url;
}
