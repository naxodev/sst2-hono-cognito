import { Todo } from '@sst2-hono-cognito/core/todo';
import { Hono } from 'hono';
import { Bindings, useJsonBody } from './utils/handler';

export function attachTodoAPI(app: Hono<{ Bindings: Bindings }>) {
  app.post('/todo/create', async (c) => {
    const body = useJsonBody();

    console.log(body);

    await Todo.create();

    return c.text('Todo created', { status: 201 });
  });

  app.get('/todo/list', async (c) => {
    return c.json(Todo.list());
  });
}
