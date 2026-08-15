import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Exact TikTok Brand Logo with Official Cyan and Magenta Offsets
 */
export const TikTokLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.891 2.868 2.896 2.896 0 0 1-2.892-2.868 2.896 2.896 0 0 1 2.892-2.869c.348 0 .68.058.99.162V9.45a6.37 6.37 0 0 0-.99-.077 6.34 6.34 0 0 0-6.337 6.299 6.34 6.34 0 0 0 6.337 6.299 6.34 6.34 0 0 0 6.337-6.299V8.623a8.214 8.214 0 0 0 4.769 1.51v-3.447h-.1a4.77 4.77 0 0 1-1-.001z"
      fill="#ffffff"
    />
    <path
      d="M16.697 5.922a4.793 4.793 0 0 1-3.323-3.477V2h-.878v13.672a3.774 3.774 0 0 1-3.768 3.746 3.774 3.774 0 0 1-3.768-3.746 3.774 3.774 0 0 1 3.768-3.747c.348 0 .68.058.99.162V9.45a6.37 6.37 0 0 0-.99-.077 6.34 6.34 0 0 0-6.337 6.299 6.34 6.34 0 0 0 6.337 6.299 6.34 6.34 0 0 0 6.337-6.299V8.623a8.214 8.214 0 0 0 4.769 1.51v-3.447a4.79 4.79 0 0 1-3.137-.764z"
      fill="#FE2C55"
      opacity="0.85"
    />
    <path
      d="M15.819 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-2.567v13.672a2.896 2.896 0 0 1-2.891 2.868 2.896 2.896 0 0 1-2.892-2.868 2.896 2.896 0 0 1 2.892-2.869c.348 0 .68.058.99.162V9.45a6.37 6.37 0 0 0-.99-.077 5.46 5.46 0 0 0-5.459 5.42 5.46 5.46 0 0 0 5.459 5.42 5.46 5.46 0 0 0 5.459-5.42V8.623a8.214 8.214 0 0 0 4.769 1.51v-3.447z"
      fill="#25F4EE"
      opacity="0.85"
      style={{ mixBlendMode: 'screen' }}
    />
  </svg>
);

/**
 * Exact Instagram Brand Logo with Authentic Official Radial/Linear Gradient
 */
export const InstagramLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#feda75" />
        <stop offset="25%" stopColor="#fa7e1e" />
        <stop offset="50%" stopColor="#d62976" />
        <stop offset="75%" stopColor="#962fbf" />
        <stop offset="100%" stopColor="#4f5bd5" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="6.5" fill="url(#ig-grad)" />
    <path
      d="M12 7.027c-2.742 0-4.973 2.231-4.973 4.973 0 2.742 2.231 4.973 4.973 4.973 2.742 0 4.973-2.231 4.973-4.973 0-2.742-2.231-4.973-4.973-4.973zm0 8.196a3.223 3.223 0 1 1 0-6.446 3.223 3.223 0 0 1 0 6.446z"
      fill="#ffffff"
    />
    <path
      d="M17.158 7.998a1.157 1.157 0 1 1-2.314 0 1.157 1.157 0 0 1 2.314 0z"
      fill="#ffffff"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.65 3.5H7.35C5.224 3.5 3.5 5.224 3.5 7.35v9.3c0 2.126 1.724 3.85 3.85 3.85h9.3c2.126 0 3.85-1.724 3.85-3.85v-9.3c0-2.126-1.724-3.85-3.85-3.85zm2.1 13.15a2.1 2.1 0 0 1-2.1 2.1H7.35a2.1 2.1 0 0 1-2.1-2.1v-9.3a2.1 2.1 0 0 1 2.1-2.1h9.3a2.1 2.1 0 0 1 2.1 2.1v9.3z"
      fill="#ffffff"
    />
  </svg>
);

/**
 * Exact Facebook Official Logo with Blue Circle and White "f"
 */
export const FacebookLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="12" fill="#1877F2" />
    <path
      d="M15.12 12.375l.44-2.887h-2.77V7.615c0-.791.387-1.562 1.63-1.562h1.26V3.596s-1.144-.195-2.238-.195c-2.284 0-3.777 1.385-3.777 3.892v2.195H7.152v2.887h2.513V20.25a12.08 12.08 0 0 0 3.11 0v-7.875h2.345z"
      fill="#ffffff"
    />
  </svg>
);

/**
 * Exact Google Drive Brand 3-Color Triangular Chevron Logo
 */
export const GoogleDriveLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 87.3 78"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066DA" />
    <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3L1.2 47.45c-.8 1.4-1.2 2.95-1.2 4.55h27.5z" fill="#00AC47" />
    <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.15 7.9 13.65z" fill="#EA4335" />
    <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" fill="#00832D" />
    <path d="m59.8 53-16.15-28H16.2L29.9 48.75 43.65 72.5H71z" fill="#2684FC" />
    <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3L86.1 55.6c.8-1.4 1.2-2.95 1.2-4.55H59.8l13.75 25.75z" fill="#FFBA00" />
  </svg>
);

/**
 * Exact Google Sheets Green Spreadsheet Brand Logo
 */
export const GoogleSheetsLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
      fill="#0F9D58"
    />
    <path d="M14 2v6h6L14 2z" fill="#87CEAB" />
    <path d="M8 12h8v7H8v-7z" fill="#ffffff" />
    <path d="M9 13.5h2.5v1.5H9v-1.5zm3.5 0H15v1.5h-2.5v-1.5zM9 16h2.5v1.5H9V16zm3.5 0H15v1.5h-2.5V16z" fill="#0F9D58" />
  </svg>
);

/**
 * Exact WhatsApp Brand Logo
 */
export const WhatsAppLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="12" fill="#25D366" />
    <path
      d="M17.507 14.398c-.28-.14-1.657-.818-1.914-.912-.257-.093-.443-.14-.63.14-.187.28-.724.912-.888 1.099-.163.187-.327.21-.607.07-.28-.14-1.183-.436-2.254-1.391-.833-.744-1.396-1.663-1.56-1.943-.163-.28-.017-.432.123-.571.126-.126.28-.327.42-.49.14-.164.187-.28.28-.467.094-.187.047-.35-.023-.49-.07-.14-.63-1.52-.864-2.083-.227-.549-.459-.474-.63-.483l-.538-.01c-.187 0-.49.07-.747.35-.257.28-.981.958-.981 2.336 0 1.378 1.004 2.71 1.144 2.897.14.187 1.977 3.018 4.789 4.232.669.29 1.191.463 1.599.593.672.213 1.284.183 1.768.111.54-.08 1.657-.677 1.89-1.331.234-.654.234-1.214.164-1.331-.07-.117-.257-.187-.537-.327z"
      fill="#ffffff"
    />
  </svg>
);

/**
 * Exact YouTube Brand Logo
 */
export const YouTubeLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
      fill="#FF0000"
    />
    <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#ffffff" />
  </svg>
);

/**
 * Exact X / Twitter Brand Logo
 */
export const XLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
