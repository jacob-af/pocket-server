import * as bodyParser from 'body-parser';

import { NextFunction, Request, Response } from 'express';

export function StripeRawBodyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.originalUrl === '/webhooks/stripe') {
    bodyParser.raw({ type: 'application/json' })(req, res, next);
  } else {
    next();
  }
}
