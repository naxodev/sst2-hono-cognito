import { Todo } from '@sst2-hono-cognito/core/todo';
import { Hono } from 'hono';
import { Bindings, useJsonBody } from './utils/handler';

const app = new Hono<{ Bindings: Bindings }>();

app.post('/create', async (c) => {
  const body = useJsonBody();

  console.log(body);

  await Todo.create();

  return c.text('Todo created', { status: 201 });
});

app.get('/list', async (c) => {
  return c.json(Todo.list());
});

export default app
