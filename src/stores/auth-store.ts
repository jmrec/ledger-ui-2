import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'


export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()

    // const token = ref<string | null>(localStorage.getItem('token'))
    // const member = ref<string | null>(localStorage.getItem('member'))
    const token = ref<string | null>(null)
    const member = ref<string | null>(null)
    const loading = ref(false)

    function login() {
        window.location.href = 'https://api.jmrecondo.com/auth/login?redirect_to=https://spotify.jmrecondo.com';
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