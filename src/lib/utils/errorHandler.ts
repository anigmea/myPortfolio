// Error handling utilities

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string = 'Rate limit exceeded', public retryAfter?: number) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export function handleError(error: unknown): { message: string; statusCode: number } {
  if (error instanceof APIError) {
    return { message: error.message, statusCode: error.statusCode };
  }
  if (error instanceof ValidationError) {
    return { message: error.message, statusCode: 400 };
  }
  if (error instanceof RateLimitError) {
    return { message: error.message, statusCode: 429 };
  }
  if (error instanceof Error) {
    return { message: error.message, statusCode: 500 };
  }
  return { message: 'An unknown error occurred', statusCode: 500 };
}




