/* eslint-disable prettier/prettier */
import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const GetRawHeaders = createParamDecorator((ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const rawHeaders = req.rawHeaders;
  if (!rawHeaders) {
    throw new InternalServerErrorException('Raw not found (request)');
  }
  return rawHeaders;
});
