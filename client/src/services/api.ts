import type { ShortenUrlRequest, ShortenUrlResponse, ApiValidationError } from '../types/url';

const envBase = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_API_BASE_URL : '';
export const API_BASE_URL = (envBase || '').replace(/\/+$/, '');

/**
 * Returns the base URL used to construct the public short link.
 * Defaults to VITE_API_BASE_URL or http://localhost:8000 if not configured.
 */
export function getRedirectBaseUrl(): string {
  if (API_BASE_URL) {
    return API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'http://localhost:8000';
}

/**
 * Constructs the full short URL redirect link from a short code.
 */
export function buildShortUrl(shortCode: string): string {
  const base = getRedirectBaseUrl();
  return `${base}/${shortCode}`;
}

/**
 * Normalizes user input by prepending https:// if protocol is missing.
 */
export function normalizeUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Validates whether the given string is a valid HTTP/HTTPS URL.
 */
export function validateUrlInput(rawUrl: string): { isValid: boolean; error?: string; normalizedUrl: string } {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please enter a URL to shorten.',
      normalizedUrl: '',
    };
  }

  const normalized = normalizeUrl(trimmed);

  try {
    const parsed = new URL(normalized);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        isValid: false,
        error: 'Only http:// and https:// URLs are supported.',
        normalizedUrl: normalized,
      };
    }
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      return {
        isValid: false,
        error: 'Please enter a valid URL with a domain name (e.g., https://example.com).',
        normalizedUrl: normalized,
      };
    }
    return {
      isValid: true,
      normalizedUrl: normalized,
    };
  } catch {
    return {
      isValid: false,
      error: 'Please enter a valid URL (e.g., https://example.com).',
      normalizedUrl: normalized,
    };
  }
}

/**
 * Determines the API endpoint to call.
 * If in browser and origins differ (e.g. dev server on 5173 vs backend on 8000 without CORS headers),
 * routes via Vite proxy (/api/v1/urls) to prevent browser CORS errors.
 */
export function getApiEndpoint(): string {
  if (typeof window !== 'undefined' && API_BASE_URL) {
    try {
      const parsed = new URL(API_BASE_URL, window.location.href);
      if (parsed.origin !== window.location.origin) {
        return '/api/v1/urls';
      }
    } catch {
      return '/api/v1/urls';
    }
  }
  return API_BASE_URL ? `${API_BASE_URL}/api/v1/urls` : '/api/v1/urls';
}

/**
 * Calls the backend POST /api/v1/urls endpoint.
 */
export async function shortenUrl(rawUrl: string): Promise<ShortenUrlResponse> {
  const validation = validateUrlInput(rawUrl);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid URL provided.');
  }

  const payload: ShortenUrlRequest = {
    original_url: validation.normalizedUrl,
  };

  const endpoint = getApiEndpoint();

  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (primaryErr) {
    // If request failed and we tried direct endpoint, fallback to /api/v1/urls
    if (endpoint !== '/api/v1/urls') {
      try {
        response = await fetch('/api/v1/urls', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } catch (fallbackErr) {
        throw new Error('Unable to connect to the backend server. Please ensure the server is running.', {
          cause: fallbackErr,
        });
      }
    } else {
      throw new Error('Unable to connect to the backend server. Please check your connection.', {
        cause: primaryErr,
      });
    }
  }

  if (response.ok) {
    const data: ShortenUrlResponse = await response.json();
    return data;
  }

  // Handle specific status codes
  if (response.status === 422) {
    const errorJson = (await response.json().catch(() => null)) as ApiValidationError | null;
    if (errorJson && Array.isArray(errorJson.detail) && errorJson.detail.length > 0) {
      const firstDetail = errorJson.detail[0];
      throw new Error(firstDetail.msg || 'The URL provided could not be validated by the server.');
    }
    if (errorJson && typeof errorJson.detail === 'string') {
      throw new Error(errorJson.detail);
    }
    throw new Error('Invalid URL format. Please provide a valid URL like https://example.com.');
  }

  if (response.status === 503) {
    const errorJson = (await response.json().catch(() => null)) as { detail?: string } | null;
    if (errorJson?.detail) {
      throw new Error(errorJson.detail);
    }
    throw new Error('Database is temporarily unavailable. Please try again in a few moments.');
  }

  if (response.status === 500) {
    throw new Error('An unexpected server error occurred. Please try again.');
  }

  throw new Error(`Request failed with status ${response.status}. Please try again.`);
}
