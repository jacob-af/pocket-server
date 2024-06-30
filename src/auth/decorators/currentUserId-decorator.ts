import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { createParamDecorator } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    if (req.user !== undefined) {
      return req.user.userId;
    }
    return undefined;
  },
);
