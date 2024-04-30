import { Request, Response, NextFunction } from "express";
import { paginationSchema } from "../validations/pagination.validations";

export const validatePagination = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = paginationSchema.safeParse({
    page: req.query.page ? parseInt(req.query.page as string) : undefined,
    limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
  });
  if (error) {
    return res.status(400).send(error.format());
  }
  next();
};
