
interface ApiErrorParams {
  message: string;
  status: number;
  errors?: Record<string, any>;
}


export class ApiError extends Error {
  public readonly status: number;
  public readonly errors: Record<string, any>;
  
  constructor({ message, status, errors = {} }: ApiErrorParams) {
    super(message);

    this.status = status;
    this.errors = errors;
  }


  static badRequest(message: string, errors: Record<string, any> = {}): ApiError {
    return new ApiError({
      message,
      status: 400,
      errors,
    });
  }

  static unauthorized(errors: Record<string, any> = {}): ApiError {
    return new ApiError({
      message: 'unauthorized user',
      status: 401,
      errors,
    });
  }

  static notFound(errors: Record<string, any> = {}): ApiError {
    return new ApiError({
      message: 'not found',
      status: 404,
      errors,
    });
  }
}