<template>
    <q-page class="flex flex-center column q-pa-xl">
        <q-card flat bordered class="q-pa-lg rounded-borders q-mb-xl shadow-2">
            <q-img :src="`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrValue}`"
                style="width: 200px; height: 200px" />
        </q-card>

        <div class="text-center q-mb-xl">
            <div class="text-h5 text-weight-bolder">Settle Balance</div>
            <div class="text-caption text-grey-7">Scan the QR or copy the number below.</div>
        </div>

        <q-btn label="Copy GCash Number" icon="content_copy" color="primary" rounded unelevated
            class="full-width q-py-md" @click="copyToClipboard" />
    </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'

const $q = useQuasar()
const gcashNumber = "09158530407"
const qrValue = `https://pay.gcash.com/qr/${gcashNumber}`

const copyToClipboard = async () => {
    await navigator.clipboard.writeText(gcashNumber)
    $q.notify({
        message: 'GCash Number Copied!',
        color: 'positive',
        icon: 'check_circle',
        position: 'top'
    })
}
</script>