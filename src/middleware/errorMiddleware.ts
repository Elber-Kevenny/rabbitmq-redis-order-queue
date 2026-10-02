import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/apiError.js';
import 'dotenv/config' 

export const errorMiddleware = (
  er: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error caught:', er.stack || er.message);
  }

  if (er instanceof ApiError) {
    return response.status(er.status).json({
      success: false,
      message: er.message,
      errors: er.errors,
    });
  }

  return response.status(500).json({
    success: false,
    message: 'An internal server error occurred.',
  });
};