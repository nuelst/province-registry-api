import type { NextFunction, Request, Response } from 'express';
import type { AnyZodObject } from 'zod';

export function validate(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    req.body = result.body ?? req.body;
    req.params = result.params ?? req.params;
    next();
  };
}
