import { apiClient } from "@/lib/api/client"
import { getApiErrorMessage } from "@/lib/api/errors"

export interface Currency {
  code: string
  name: string
  symbol: string
  decimal_places: number
  is_base: boolean
}

export interface CurrenciesResponse {
  success: boolean
  message: string
  data: Currency[]
}

export const fetchCurrencies = async (): Promise<Currency[]> => {
  try {
    const res = await apiClient.get("/currencies")
    const response = res?.data as CurrenciesResponse
    return response?.data || []
  } catch (error) {
    console.error("Error fetching currencies:", error)
    throw error
  }
}
