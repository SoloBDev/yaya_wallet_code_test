import apiClient from "./axios"
import type { TransactionResponse } from "../types/transaction"

const API_ENDPOINTS = {
  TRANSACTIONS: "/api/transactions",
  SEARCH: "/api/transactions/search",
} as const

export async function fetchTransactions(params: { page?: number; limit?: number } = {}): Promise<TransactionResponse> {
  try {
    const { page = 1, limit = 5 } = params

    const response = await apiClient.get<TransactionResponse>(API_ENDPOINTS.TRANSACTIONS, {
      params: { p: page, limit },
    })

    return response.data
  } catch (error) {
    console.error("Error fetching transactions:", error)
    throw error
  }
}

export async function searchTransactions(
  query: string,
  params: { page?: number; limit?: number } = {},
): Promise<TransactionResponse> {
  try {
    const { page = 1, limit = 10 } = params

    const response = await apiClient.post<TransactionResponse>(API_ENDPOINTS.SEARCH, {
      query,
      p: page,
      limit,
    })

    return response.data
  } catch (error) {
    console.error("Error searching transactions:", error)
    throw error
  }
}

// Function to retry failed requests
export async function retryRequest<T>(requestFn: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error as Error
      console.warn(`Request attempt ${attempt} failed:`, error)

      if (attempt === maxRetries) {
        break
      }

      // Wait before retrying with exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
    }
  }

  throw lastError!
}
