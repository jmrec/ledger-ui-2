<template>
    <q-page class="q-pa-md">
        <div class="q-mb-xl" v-if="status">
            <div class="text-overline text-weight-bold"
                :class="status.balance! >= 0 ? 'text-positive' : 'text-negative'">
                {{ status.balance! >= 0 ? 'Balance Credit' : 'Balance Due' }}
            </div>
            <div class="text-h3 text-weight-medium">₱{{ Math.abs(status.balance!).toFixed(2) }}</div>
            <div class="text-caption text-grey-7">Total Payment Made: ₱{{ status.totalPaid?.toFixed(2) }}</div>
        </div>

        <q-card flat bordered class="rounded-borders overflow-hidden" style="height: 350px">
            <q-inner-loading :showing="loading"><q-spinner-dots size="50px" color="primary" /></q-inner-loading>
            <v-chart class="full-width full-height" :option="chartOption" autoresize />
        </q-card>
    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { api } from 'boot/api'
import type { components } from 'src/api/schema'

type BillingStatus = components['schemas']['BillingStatusResponse']
type TrendDataPoint = components['schemas']['TrendDataPoint']

const trendData = ref<TrendDataPoint[]>([])
const status = ref<BillingStatus | null>(null)
const loading = ref(true)

const chartOption = computed(() => ({
    tooltip: {
        trigger: 'axis',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
            const val = params[0].value
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
        data: trendData.value.map(d => d.balance),
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
            api.GET('/api/v1/billing/status'),
            api.GET('/api/v1/billing/trend')
        ])
        if (statusRes.data) status.value = statusRes.data
        if (trendRes.data) trendData.value = trendRes.data

        if (statusRes.error || trendRes.error) {
            console.error('API Error:', statusRes.error || trendRes.error)
        }
    } finally {
        loading.value = false
    }
})
</script>