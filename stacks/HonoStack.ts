import { Api, StackContext, use } from 'sst/constructs';

import { CognitoStack } from './CognitoStack';
import { EventStack } from './EventStack';

export function HonoStack(ctx: StackContext) {
  const { cognito } = use(CognitoStack);
  const { bus } = use(EventStack);

  const hono = new Api(ctx.stack, 'hono', {
    authorizers: {
      jwt: {
        type: 'user_pool',
        userPool: {
          id: cognito.userPoolId,
          clientIds: [cognito.userPoolClientId],
        },
      },
    },
    defaults: {
      authorizer: 'jwt',
      function: {
        bind: [bus],
        runtime: 'nodejs20.x',
      },
    },
    routes: {
      // Needed because of https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html#http-api-cors-default-route
      'OPTIONS /{proxy+}': {
        authorizer: 'none',
        function: 'packages/functions/src/cors.handler',
      },
      $default: 'packages/functions/src/index.handler',
    },
  });

  cognito.attachPermissionsForAuthUsers(ctx.stack, [hono]);

  ctx.stack.addOutputs({
    HonoEndpoint: hono.url,
  });

  return { hono };
}
