/**
 * Centralized constants for the entire app.
 * Change values here to update them everywhere.
 */

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' }
];

export const THEMES = [
  {
    id: 'neon-noir',
    label: 'Neon Noir',
    description: 'Netflix-style dark purple & gold',
    icon: '🌌',
    preview: {
      bg: '#0a0a0f',
      accent: '#a855f6',
      text: '#e4e4f0'
    }
  },
  {
    id: 'western-comic',
    label: 'Western Comic',
    description: 'Bold pop-art with halftone dots',
    icon: '💥',
    preview: {
      bg: '#fff8e1',
      accent: '#d32f2f',
      text: '#1a1a1a'
    }
  },
  {
    id: 'manga',
    label: 'Manga',
    description: 'Clean minimal Japanese style',
    icon: '🎌',
    preview: {
      bg: '#fafafa',
      accent: '#c62828',
      text: '#1a1a1a'
    }
  },
  {
    id: 'cartoon-flat',
    label: 'Cartoon Flat',
    description: 'Bright, rounded, playful',
    icon: '🎨',
    preview: {
      bg: '#f0fdf4',
      accent: '#f97316',
      text: '#1e293b'
    }
  },
  {
    id: 'graphic-novel',
    label: 'Graphic Novel',
    description: 'Dark moody dramatic panels',
    icon: '📖',
    preview: {
      bg: '#0f0f0f',
      accent: '#8b2252',
      text: '#d4c5a9'
    }
  }
];

export const CATEGORIES = [
  'Food',
  'Transport',
  'Utilities',
  'Entertainment',
  'Health',
  'Shopping',
  'Travel',
  'Other'
];