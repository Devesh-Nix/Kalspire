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

// Optimize Cloudinary URLs with dynamic resizing and quality flags
export function optimizeImageUrl(url: string, width?: number, height?: number): string {
  if (!url) return url;

  // If it's a Google Drive URL, use that converter first
  if (url.includes('drive.google.com')) {
    return convertGoogleDriveUrl(url);
  }

  // Check if it's a Cloudinary URL
  if (url.includes('res.cloudinary.com')) {
    // Cloudinary URL pattern: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>
    // We want to insert transformations after 'upload/'
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const parts = [
        'f_auto', // Auto format (WebP/AVIF)
        'q_auto', // Auto quality
      ];

      if (width) parts.push(`w_${width}`);
      if (height) parts.push(`h_${height}`);
      if (width || height) parts.push('c_limit'); // Constraint: fit within box

      const transformationString = parts.join(',');
      return `${url.slice(0, uploadIndex + 8)}${transformationString}/${url.slice(uploadIndex + 8)}`;
    }
  }

  return url;
}
