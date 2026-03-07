<template>
    <q-page class="q-pa-md">
        <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
                <div class="text-h6 q-mb-md">Payment History</div>
                <q-table :rows="payments" :columns="paymentColumns" row-key="id" flat bordered :loading="loading">
                    <template v-slot:body-cell-amount="props">
                        <q-td :props="props" class="text-right text-weight-bold">
                            ₱{{ props.value.toFixed(2) }}
                        </q-td>
                    </template>
                </q-table>
            </div>

            <div class="col-12 col-md-6">
                <div class="text-h6 q-mb-md">Service Prices</div>
                <q-table :rows="servicePrices" :columns="priceColumns" row-key="id" flat bordered :loading="loading">
                    <template v-slot:body-cell-price="props">
                        <q-td :props="props" class="text-right text-weight-bold">
                            ₱{{ props.value.toFixed(2) }}
                        </q-td>
                    </template>
                </q-table>
            </div>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from 'boot/api'
import type { components } from 'src/api/schema'
import type { QTableColumn } from 'quasar'

type Payment = components['schemas']['PaymentResponse']
interface PriceRow {
    price: number;
    date: string;
    serviceName: string;
}

const payments = ref<Payment[]>([])
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
            api.GET('/api/v1/billing/history'),
            api.GET('/api/v1/billing/price-history')
        ])

        if (historyRes.data) payments.value = historyRes.data
        if (priceRes.data) {
            const transformed: PriceRow[] = []

            for (const [serviceName, points] of Object.entries(priceRes.data)) {
                points.forEach(point => {
                    transformed.push({
                        price: point.price ?? 0,
                        date: point.date ?? '',
                        serviceName: serviceName
                    })
                })
            }
            servicePrices.value = transformed.sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )
        }

        if (historyRes.error || priceRes.error) {
            console.error('API Error:', historyRes.error || priceRes.error)
        }
    } catch (e) {
        console.error('Network failure:', e)
    } finally {
        loading.value = false
    }
})
</script>