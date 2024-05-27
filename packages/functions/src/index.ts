import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { HTTPException } from 'hono/http-exception';
import { Bindings } from './utils/handler';
import { attachTodoAPI } from './todo';

const app = new Hono<{ Bindings: Bindings }>();

attachTodoAPI(app);

app.onError((err, c) => {
  console.error(err);
  if (err instanceof HTTPException) {
    // Get the custom response
    return err.getResponse();
  }
  return c.json({ message: 'Internal Server Error' }, { status: 500 });
});

export const handler = handle(app);
