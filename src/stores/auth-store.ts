import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/api'
import { useQuasar } from 'quasar'
import type { components } from 'src/api/schema'

type LoginRequest = components['schemas']['LoginRequest']

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()
    const $q = useQuasar()

    // const token = ref<string | null>(localStorage.getItem('token'))
    // const member = ref<string | null>(localStorage.getItem('member'))
    const token = ref<string | null>(null)
    const member = ref<string | null>(null)
    const loading = ref(false)

    async function login(payload: LoginRequest) {
        loading.value = true
        const { data, error } = await api.POST('/api/auth/login', {
            body: payload
        })

        if (data) {
            token.value = data.token ?? null
            member.value = data.name ?? null

            if (token.value) {
                // localStorage.setItem('token', token.value)
                // localStorage.setItem('member', member.value ?? '')

                await router.push('/')
                loading.value = false
                return true
            }
        }

        if (error) {
            $q.notify({
                color: 'negative',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                message: (error as any).message || 'Login failed. Please check your credentials.',
                icon: 'report_problem'
            })
        }

        loading.value = false
        return false
    }

    async function logout() {
        token.value = null
        member.value = null
        // localStorage.removeItem('token')
        // localStorage.removeItem('member')
        await router.push('/auth/login')
    }

    return {
        token,
        member,
        login,
        loading,
        logout
    }
}, { persist: true })