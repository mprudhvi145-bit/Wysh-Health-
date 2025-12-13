
export interface ErrorPayload {
  code: string;
  message: string;
  userSafe: boolean;
  traceId?: string;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly userSafe: boolean;
  public readonly status: number;
  public readonly traceId?: string;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', status: number = 500, userSafe: boolean = false, traceId?: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.userSafe = userSafe;
    this.traceId = traceId;
  }

  static fromApiError(err: any): AppError {
    // If it's already an AppError (re-thrown), return it
    if (err instanceof AppError) return err;

    // Handle structured backend error response
    if (err.details && err.details.error) {
       const e = err.details.error;
       return new AppError(
         e.message || 'An unexpected error occurred.', 
         e.code || 'API_ERROR', 
         err.status || 500, 
         e.userSafe || false,
         e.traceId
       );
    }

    // Fallback for network or unknown errors
    const message = err.message || 'An unexpected network error occurred.';
    const status = err.status || 500;
    // Assume 4xx errors are generally user-safe (validation, auth), 5xx are not
    const userSafe = status >= 400 && status < 500;
    
    return new AppError(message, 'NETWORK_ERROR', status, userSafe);
  }
}

export const isUserSafeError = (error: unknown): boolean => {
  return error instanceof AppError && error.userSafe;
};
