import 'dotenv/config';
import { createApp } from './app.js';

const port = Number(process.env.PORT || 3001);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error('PORT must be a valid TCP port.');
const server = createApp().listen(port, '0.0.0.0', () => {
  console.info(
    `[BLUE API] Listening on port ${port} (${process.env.NODE_ENV === 'production' ? 'production' : 'development'}).`,
  );
});
function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
