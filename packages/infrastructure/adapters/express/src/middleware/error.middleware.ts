import { Request, Response, NextFunction } from 'express';

type RouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function asyncHandler(handler: RouteHandler): RouteHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error: any) {
      console.error('API Error:', error);

      const status = error.status || error.statusCode || 500;
      const message = error.message || 'Internal Server Error';

      res.status(status).json({
        success: false,
        error: message,
      });
    }
  };
}

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', error);

  const status = error.status || error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    error: message,
  });
}
