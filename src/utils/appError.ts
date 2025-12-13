
export class AppError extends Error {
  public readonly code: string;
  public readonly userSafe: boolean;
  public readonly status: number;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', status: number = 500, userSafe: boolean = false) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.userSafe = userSafe;
  }

  static fromApiError(err: any): AppError {
    const message = err.message || 'An unexpected error occurred.';
    // Assume 4xx errors are generally user-safe (validation, auth), 5xx are not
    const status = err.status || 500;
    const userSafe = status < 500;
    
    return new AppError(message, err.code || 'API_ERROR', status, userSafe);
  }
}

export const isUserSafeError = (error: unknown): boolean => {
  return error instanceof AppError && error.userSafe;
};
