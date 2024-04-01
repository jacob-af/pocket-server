import { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    console.log('ding!!');
    console.log(req.user.userId);
    return req.user.userId;
  },
);
