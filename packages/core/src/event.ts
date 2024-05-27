import { ZodValidator, createEventBuilder } from 'sst/node/event-bus';

export const event = createEventBuilder({
  bus: 'bus',
  validator: ZodValidator,
});
