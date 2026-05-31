import { createClient } from '@connectrpc/connect'
import { BillingService } from '@buf/jmrecondo_personal-server.bufbuild_es/ledger/v1/billing_pb'
import { transport } from 'boot/connectrpc'

let billingClient: ReturnType<typeof createClient<typeof BillingService>> | null = null

export function useBillingClient() {
    if (!billingClient) {
        billingClient = createClient(BillingService, transport)
    }
    return billingClient
}

export function moneyToNumber(m?: { units?: bigint; nanos?: number }): number {
    if (!m) return 0
    return Number(m.units ?? 0n) + (m.nanos ?? 0) / 1e9
}