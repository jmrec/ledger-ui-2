import { defineBoot } from '#q-app/wrappers';
import createClient, { type Client } from 'openapi-fetch';
import type { paths } from 'src/api/schema';
import { useAuthStore } from 'src/stores/auth-store';

declare module 'vue' {
    interface ComponentCustomProperties {
        $api: Client<paths, `${string}/${string}`>;
    }
}

const api = createClient<paths>({
    baseUrl: 'https://spotify.jmrecondo.com',
    headers: { 'Content-Type': 'application/json' }
});

api.use({
    onRequest({ request }) {
        const token = localStorage.getItem('token');
        if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
        }
        return request;
    },

    async onResponse({ response }) {
        if (response.status === 401) {
            const auth = useAuthStore();
            await auth.logout();
        }
        return response;
    },
});

export default defineBoot(({ app }) => {
    app.config.globalProperties.$api = api;
});

export { api };