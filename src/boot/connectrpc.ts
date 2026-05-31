import { defineBoot } from '#q-app/wrappers';
import { createConnectTransport } from '@connectrpc/connect-web';

let transport: ReturnType<typeof createConnectTransport>;

export default defineBoot(({ app }) => {
  transport = createConnectTransport({
    baseUrl: 'https://api.jmrecondo.com',
    fetch: (input, init) => fetch(input, { ...init, credentials: 'include' }),
  });

  app.config.globalProperties.$transport = transport;
});

export { transport };