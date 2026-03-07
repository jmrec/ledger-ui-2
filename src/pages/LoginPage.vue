<template>
    <q-page class="flex flex-center">
        <q-card flat bordered class="auth-card q-pa-lg shadow-3">
            <q-card-section class="text-center">
                <q-avatar size="80px" color="primary" text-color="white" icon="account_balance_wallet"
                    class="q-mb-md" />
                <div class="text-caption text-grey-8">Manage your collections with zero effort</div>
            </q-card-section>

            <q-card-section>
                <q-form @submit="onSubmit" class="q-gutter-y-md">
                    <q-input v-model="form.username" label="Username" outlined dense
                        :rules="[val => !!val || 'Username is required']" autofocus>
                        <template v-slot:prepend><q-icon name="person" /></template>
                    </q-input>

                    <q-input v-model="form.password" label="Password" :type="isPwd ? 'password' : 'text'" outlined dense
                        :rules="[val => !!val || 'Password is required']">
                        <template v-slot:prepend><q-icon name="lock" /></template>
                        <template v-slot:append>
                            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                @click="isPwd = !isPwd" />
                        </template>
                    </q-input>

                    <q-btn label="Login" type="submit" color="primary" class="full-width q-mt-md" unelevated rounded
                        :loading="auth.loading" />
                </q-form>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from 'src/stores/auth-store'

const auth = useAuthStore()
const isPwd = ref(true)

const form = reactive({
    username: '',
    password: ''
})

const onSubmit = async () => {
    await auth.login(form)
}
</script>

<style scoped>
.auth-card {
    width: 100%;
    max-width: 360px;
    border-radius: 24px;
}
</style>