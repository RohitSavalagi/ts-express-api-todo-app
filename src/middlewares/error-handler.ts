// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import logger from "../utils/error.logger";

interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;

  logger.error(`[${req.method}] ${req.url} - ${err.message}`, {
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
