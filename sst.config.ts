import { SSTConfig } from 'sst';
import { HonoStack } from './stacks/HonoStack';
import { EventStack } from './stacks/EventStack';
import { CognitoStack } from './stacks/CognitoStack';

export default {
  config(_input) {
    return {
      name: 'sst2-hono-cognito',
      region: 'us-east-1',
    };
  },
  stacks(app) {
    app.stack(CognitoStack);
    app.stack(EventStack);
    app.stack(HonoStack);
  },
} satisfies SSTConfig;
