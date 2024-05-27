import { Cognito, StackContext, use } from 'sst/constructs';

export function CognitoStack(ctx: StackContext) {
  const cognito = new Cognito(ctx.stack, 'cognito', {
    login: ['email'],
  });

  ctx.stack.addOutputs({
    UserPoolId: cognito.userPoolId,
    UserPoolClientId: cognito.userPoolClientId,
    IdentityPoolId: cognito.cognitoIdentityPoolId,
  });

  return { cognito };
}
