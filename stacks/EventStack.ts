import { StackContext, EventBus } from 'sst/constructs';

export function EventStack({ stack }: StackContext) {
  const bus = new EventBus(stack, 'bus', {
    defaults: {
      retries: 10,
    },
  });

  bus.subscribe('todo.created', {
    handler: 'packages/functions/src/events/todo-created.handler',
  });

  return { bus };
}
