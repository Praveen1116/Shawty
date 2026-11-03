import React, { useState, useRef } from 'react';
import { Link2, Loader2, Copy, Check, ExternalLink, AlertCircle, X, RotateCcw } from 'lucide-react';
import { shortenUrl, buildShortUrl, validateUrlInput } from '../services/api';
import type { ShortenUrlResponse } from '../types/url';

export const UrlShortenerForm: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ShortenUrlResponse | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    setError(null);

    const validation = validateUrlInput(inputUrl);
    if (!validation.isValid) {
      setError(validation.error || 'Please enter a valid URL.');
      inputRef.current?.focus();
      return;
    }

    setIsLoading(true);

    try {
      const response = await shortenUrl(inputUrl);
      setResult(response);
      setIsCopied(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while shortening the link.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    const shortUrl = buildShortUrl(result.short_code);
    try {
      await navigator.clipboard.writeText(shortUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // Fallback for older environments
      const textArea = document.createElement('textarea');
      textArea.value = shortUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      } catch {
        setError('Could not copy link to clipboard. Please copy it manually.');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleReset = () => {
    setInputUrl('');
    setResult(null);
    setError(null);
    setIsCopied(false);
    inputRef.current?.focus();
  };

  const shortUrl = result ? buildShortUrl(result.short_code) : '';

  return (
    <div className="mx-auto w-full max-w-2xl px-4">
      {/* Primary URL Input Form */}
      <form
        onSubmit={handleSubmit}
        className="group relative flex flex-col sm:flex-row items-stretch rounded-2xl border border-neutral-300/80 bg-white p-2 shadow-xs transition-all hover:border-neutral-400 focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/5 focus-within:shadow-md"
      >
        <div className="relative flex flex-1 items-center min-w-0 pl-3 pr-2 py-1.5 sm:py-0">
          <Link2 className="h-5 w-5 shrink-0 text-neutral-400 group-focus-within:text-neutral-700 transition-colors" />
          <input
            ref={inputRef}
            type="text"
            autoFocus
            value={inputUrl}
            onChange={(e) => {
              setInputUrl(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Paste your long URL here..."
            disabled={isLoading}
            className="w-full min-w-0 bg-transparent px-3 py-2 text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Long URL to shorten"
            autoComplete="off"
            spellCheck={false}
          />
          {inputUrl && !isLoading && (
            <button
              type="button"
              onClick={() => {
                setInputUrl('');
                setError(null);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label="Clear input"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-sm sm:text-base font-medium text-white shadow-xs transition-all hover:bg-neutral-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer sm:shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-neutral-300" />
              <span>Shortening...</span>
            </>
          ) : (
            <span>Shorten Now</span>
          )}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="mt-3 flex items-start gap-3 rounded-xl border border-red-200/90 bg-red-50/80 p-3.5 text-sm text-red-800 transition-all"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
          <div className="flex-1 leading-relaxed">{error}</div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 p-0.5"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Generated Short URL Success Card */}
      {result && (
        <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs transition-all">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Shortened Link Ready
              </span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Shorten Another</span>
            </button>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Links preview */}
            <div className="min-w-0 flex-1">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 font-mono text-base sm:text-lg font-bold text-neutral-900 hover:text-neutral-700 transition-colors break-all"
              >
                <span>{shortUrl}</span>
                <ExternalLink className="h-4 w-4 shrink-0 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
              </a>
              <p className="mt-1 truncate text-xs text-neutral-500" title={result.original_url}>
                Destination: <span className="font-mono text-neutral-600">{result.original_url}</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:shrink-0">
              <button
                type="button"
                onClick={handleCopy}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  isCopied
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800'
                }`}
                aria-label="Copy short URL"
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                title="Open short URL in new tab"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

