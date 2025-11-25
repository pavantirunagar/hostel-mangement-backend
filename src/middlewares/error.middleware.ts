import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("ERROR 💥", err);

  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message || "Something went wrong",
  });
};

export default globalErrorHandler;
