import { createClient } from '@connectrpc/connect'
import { AuthService } from '@buf/jmrecondo_personal-server.bufbuild_es/auth/v1/auth_pb'
import { transport } from 'boot/connectrpc'

let authClient: ReturnType<typeof createClient<typeof AuthService>> | null = null

export function useAuthClient() {
    if (!authClient) {
        authClient = createClient(AuthService, transport)
    }
    return authClient
}