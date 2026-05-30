<template>
    <q-page class="q-pa-md">
        <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
                <div class="text-h6 q-mb-md">Payment History</div>
                <q-table :rows="payments" :columns="paymentColumns" row-key="id" flat bordered :loading="loading">
                    <template v-slot:body-cell-amount="props">
                        <q-td :props="props" class="text-right text-weight-bold">
                            ₱{{ moneyToNumber(props.row.amount).toFixed(2) }}
                        </q-td>
                    </template>
                </q-table>
            </div>

            <div class="col-12 col-md-6">
                <div class="text-h6 q-mb-md">Service Prices</div>
                <q-table :rows="servicePrices" :columns="priceColumns" row-key="id" flat bordered :loading="loading">
                    <template v-slot:body-cell-price="props">
                        <q-td :props="props" class="text-right text-weight-bold">
                            ₱{{ moneyToNumber(props.row.price).toFixed(2) }}
                        </q-td>
                    </template>
                </q-table>
            </div>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { QTableColumn } from 'quasar'

import { BillingService, type PaymentResponse } from '@buf/jmrecondo_personal-server.bufbuild_es/ledger/v1/billing_pb';
import { transport } from 'boot/connectrpc';

interface PriceRow {
    price: number;
    date: string;
    serviceName: string;
}

const client = new BillingService(transport);

const payments = ref<PaymentResponse[]>([])
const servicePrices = ref<PriceRow[]>([])
const loading = ref(true)

const paymentColumns: QTableColumn[] = [
    { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
    { name: 'service', label: 'Service', field: 'serviceName', align: 'left' },
    { name: 'amount', label: 'Amount', field: 'amount', align: 'right' },
    { name: 'ref', label: 'Reference', field: 'reference', align: 'left' }
]

const priceColumns: QTableColumn[] = [
    { name: 'effectiveDate', label: 'Effective Date', field: 'date', align: 'left', sortable: true },
    { name: 'service', label: 'Service', field: (row: PriceRow) => row.serviceName, align: 'left' },
    { name: 'price', label: 'Price', field: 'price', align: 'right' }
]

onMounted(async () => {
    try {
        const [historyRes, priceRes] = await Promise.all([
            client.getPaymentHistory({}),
            client.getPriceHistory({})
        ])

        payments.value = historyRes.payments

        const transformed: PriceRow[] = []
        for (const [serviceName, history] of Object.entries(priceRes.prices)) {
            for (const point of history.points) {
                transformed.push({
                    price: moneyToNumber(point.price),
                    date: point.date,
                    serviceName
                })
            }
        }
        servicePrices.value = transformed.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
    } catch (e) {
        console.error('Network failure:', e)
    } finally {
        loading.value = false
    }
})

function moneyToNumber(m?: { units?: bigint; nanos?: number }): number {
    if (!m) return 0
    return Number(m.units ?? 0n) + (m.nanos ?? 0) / 1e9
}
</script>