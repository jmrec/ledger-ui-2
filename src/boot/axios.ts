// import { defineBoot } from '#q-app/wrappers';
// import axios, { type AxiosInstance } from 'axios';
// import { useAuthStore } from 'src/stores/auth-store';

// declare module 'vue' {
//   interface ComponentCustomProperties {
//     $axios: AxiosInstance;
//     $api: AxiosInstance;
//   }
// }

// // Be careful when using SSR for cross-request state pollution
// // due to creating a Singleton instance here;
// // If any client changes this (global) instance, it might be a
// // good idea to move this instance creation inside of the
// // "export default () => {}" function below (which runs individually
// // for each client)
// const api: AxiosInstance = axios.create({
//   baseURL: 'https://spotify.jmrecondo.com',
//   headers: { 'Content-Type': 'application/json' }
// });

// export default defineBoot(({ app }) => {
//   // for use inside Vue files (Options API) through this.$axios and this.$api
//   const token = localStorage.getItem('token');
//   if (token) {
//     api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   }

//   api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       if (error.response?.status === 401) {
//         const auth = useAuthStore();
//         await auth.logout();
//       }
//       return Promise.reject(error instanceof Error ? error : new Error(error));
//     }
//   );

//   app.config.globalProperties.$axios = axios;
//   // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
//   //       so you won't necessarily have to import axios in each vue file

//   app.config.globalProperties.$api = api;
//   // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
//   //       so you can easily perform requests against your app's API
// });

// export { api };
