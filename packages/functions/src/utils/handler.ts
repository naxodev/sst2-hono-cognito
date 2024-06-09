import {
  APIGatewayEventRequestContextJWTAuthorizer,
  APIGatewayEventRequestContextV2,
  APIGatewayEventRequestContextV2WithAuthorizer,
  APIGatewayProxyEventV2WithJWTAuthorizer,
} from 'aws-lambda';
import { Context as SSTContext, memo } from 'sst/context/context2.js';
import { ZodError } from 'zod';
import { HTTPException } from 'hono/http-exception';
import type { TypedResponse } from 'hono';
import type {
  LambdaEvent as HonoLambdaEvent,
  LambdaContext,
} from 'hono/aws-lambda';
import type { Context } from 'hono';

export type LambdaEvent =
  | HonoLambdaEvent
  | APIGatewayProxyEventV2WithJWTAuthorizer;

export type HonoContext = Context<{
  Bindings: Bindings;
}>;

export type HonoRequest = {
  context: LambdaContext;
  event: LambdaEvent;
};

export type Bindings = {
  event: LambdaEvent;
  requestContext: HonoLambdaEvent['requestContext'];
  lambdaContext: LambdaContext;
};

export function handleErrors(error: unknown): TypedResponse {
  if (error instanceof ZodError) {
    throw new HTTPException(400, {
      message: 'Invalid input',
      cause: error.issues,
    });
  }

  throw error;
}

const HonoRequestContext = SSTContext.create<HonoContext>('HonoRequestContext');

export function HonoApiHandler(cb: Parameters<typeof Handler>[0]) {
  return Handler(async (c) => {
    let result: TypedResponse;
    try {
      result = await cb(c);
    } catch (e) {
      result = handleErrors(e);
    }
    return result;
  });
}

export function Handler(cb: (c: HonoContext) => Promise<TypedResponse>) {
  return function handler(c: HonoContext) {
    return HonoRequestContext.with(c, () => cb(c));
  };
}

export const useHonoContext = HonoRequestContext.use;

export function useEvent() {
  const ctx = useHonoContext();
  return ctx.env.event;
}

export function useLambdaContext() {
  const ctx = useHonoContext();
  return ctx.env.lambdaContext;
}

export function useDomainName() {
  const evt = useEvent();
  return (evt.requestContext as unknown as APIGatewayEventRequestContextV2)
    .domainName;
}

export function useMethod() {
  const evt = useEvent();
  return (evt.requestContext as unknown as APIGatewayEventRequestContextV2).http
    .method;
}

export function useHeaders() {
  const evt = useEvent();
  return evt.headers || {};
}

export function useHeader(key: string) {
  const headers = useHeaders();
  return headers[key];
}

export function useQueryParams() {
  const evt = useEvent();
  const query = evt.queryStringParameters || {};
  return query;
}

export function useJWT() {
  const evt = useEvent();
  return (
    evt.requestContext as unknown as APIGatewayEventRequestContextV2WithAuthorizer<APIGatewayEventRequestContextJWTAuthorizer>
  ).authorizer.jwt;
}

export function useClaim(claim: string) {
  const jwt = useJWT();
  return jwt.claims[claim];
}

export function useQueryParam<T = string>(name: string) {
  return useQueryParams()[name] as T | undefined;
}

export function usePathParams() {
  const ctx = useHonoContext();
  return ctx.req.param();
}

export function usePathParam(name: string) {
  const ctx = useHonoContext();
  return ctx.req.param(name);
}

export const useBody = /* @__PURE__ */ memo(() => {
  const evt = useEvent();
  if (!evt.body) return;
  const body = evt.isBase64Encoded
    ? Buffer.from(evt.body, 'base64').toString()
    : evt.body;
  return body;
});

export const useJsonBody = /* @__PURE__ */ memo(() => {
  const body = useBody();
  if (!body) return;
  return JSON.parse(body);
});
