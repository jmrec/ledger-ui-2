import { defineStore } from 'pinia'
import { useAuthClient } from 'src/composables/useAuthClient'
import { ref } from 'vue'
import { ConnectError, Code } from '@connectrpc/connect'
import { useRouter } from 'vue-router'


export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()
    const member = ref<string | null>(null)
    const isAuthenticated = ref(false)
    const isChecking = ref(false)

    const authClient = useAuthClient()

    async function checkSession() {
        isChecking.value = true
        try {
            const resp = await authClient.whoAmI({})
            member.value = resp.username
            isAuthenticated.value = true
        } catch (e: unknown) {
            console.error('Session check failed:', e)
            if (e instanceof ConnectError && e.code === Code.Unauthenticated) {
                isAuthenticated.value = false
                member.value = null
            }
        } finally {
            isChecking.value = false
        }
    }

    function login() {
        window.location.href = `https://api.jmrecondo.com/auth/login?redirect_to=${window.location.origin}`;
    }

    async function logout() {
        await authClient.logout({})
        isAuthenticated.value = false
        member.value = null
        await router.push('/')
    }

    return {
        member,
        isAuthenticated,
        isChecking,
        checkSession,
        login,
        logout
    }
}, { persist: true })