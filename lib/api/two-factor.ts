import { apiClient } from "./client"

export interface ApiActionResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
}

export async function enableTwoFactor(password: string) {
  const { data } = await apiClient.post<ApiActionResponse>("/two-factor/enable", {
    password,
  })
  return data
}

export async function getTwoFactorQrCode() {
  const { data } = await apiClient.get<unknown>("/two-factor/qr-code")
  return data
}

export async function confirmTwoFactor(code: string) {
  const { data } = await apiClient.post<ApiActionResponse>("/two-factor/confirm", {
    code,
  })
  return data
}

export async function getTwoFactorRecoveryCodes() {
  const { data } = await apiClient.get<ApiActionResponse>("/two-factor/recovery-codes")
  return data
}

export async function regenerateTwoFactorRecoveryCodes(password: string) {
  const { data } = await apiClient.post<ApiActionResponse>(
    "/two-factor/recovery-codes/regenerate",
    {
      password,
    }
  )
  return data
}

export async function disableTwoFactor(password: string) {
  const { data } = await apiClient.delete<ApiActionResponse>("/two-factor/disable", {
    data: {
      password,
    },
  })
  return data
}
