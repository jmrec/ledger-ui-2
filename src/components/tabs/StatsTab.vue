<template>
    <q-page class="q-pa-md">
        <div class="q-mb-xl" v-if="status">
            <div class="text-overline text-weight-bold" :class="balance >= 0 ? 'text-positive' : 'text-negative'">
                {{ balance >= 0 ? 'Balance Credit' : 'Balance Due' }}
            </div>
            <div class="text-h3 text-weight-medium">₱{{ Math.abs(balance).toFixed(2) }}</div>
            <div class="text-caption text-grey-7">Total Payment Made: ₱{{ totalPaid.toFixed(2) }}</div>
        </div>

        <q-card flat bordered class="rounded-borders overflow-hidden" style="height: 350px">
            <q-inner-loading :showing="loading"><q-spinner-dots size="50px" color="primary" /></q-inner-loading>
            <v-chart class="full-width full-height" :option="chartOption" autoresize />
        </q-card>
    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useBillingClient, moneyToNumber } from 'src/composables/useBillingClient'
import type { GetBillingStatusResponse, TrendDataPoint } from '@buf/jmrecondo_personal-server.bufbuild_es/ledger/v1/billing_pb'

const client = useBillingClient()

const trendData = ref<TrendDataPoint[]>([])
const status = ref<GetBillingStatusResponse | null>(null)
const loading = ref(true)

const balance = computed(() => moneyToNumber(status.value?.balance) || 0)
const totalPaid = computed(() => moneyToNumber(status.value?.totalPaid) || 0)

const chartOption = computed(() => ({
    tooltip: {
        trigger: 'axis',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
            const val = params[0].value
            if (val == null) return ''
            return `${params[0].name}<br/><b>₱${val.toFixed(2)}</b>`
        }
    },
    grid: {
        top: '10%',
        left: '5%',
        right: '5%',
        bottom: '10%'
    },
    xAxis: {
        type: 'category',
        data: trendData.value.map(d => d.date?.substring(0, 7) || ''), // Shows "2021-02"
        axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: {
        type: 'value',
        splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } }
    },
    series: [{
        data: trendData.value.map(d => moneyToNumber(d.balance)),
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#6366f1', width: 3 },
        areaStyle: {
            color: {
                type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: 'rgba(99, 102, 241, 0.2)' },
                    { offset: 1, color: 'transparent' }
                ]
            }
        },
        visualMap: {
            show: false,
            pieces: [{ gt: 0, color: '#6366f1' }, { lte: 0, color: '#ef4444' }]
        }
    }]
}))

onMounted(async () => {
    try {
        const [statusRes, trendRes] = await Promise.all([
            client.getBillingStatus({}),
            client.getBalanceTrend({})
        ])
        status.value = statusRes
        trendData.value = trendRes.trend ?? []
    } catch (e: unknown) {
        console.error('API Error:', e)
    } finally {
        loading.value = false
    }
})
</script>