export interface ShortenUrlRequest {
  original_url: string;
}

export interface ShortenUrlResponse {
  short_code: string;
  original_url: string;
}

export interface ApiValidationErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ApiValidationError {
  detail: ApiValidationErrorDetail[] | string;
}

