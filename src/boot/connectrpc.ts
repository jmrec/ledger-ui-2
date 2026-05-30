import { defineBoot } from '#q-app/wrappers';
import { createConnectTransport } from '@connectrpc/connect-web';

const transport = createConnectTransport({
  baseUrl: 'https://api.jmrecondo.com',
  fetch: (input, init) => fetch(input, { ...init, credentials: 'include' }),
});

export default defineBoot(({ app }) => {
  app.config.globalProperties.$transport = transport;
});

export { transport };