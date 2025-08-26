export interface TransactionUser {
   name: string
   account: string
}

export interface Transaction {
  id: string
  sender: TransactionUser
  receiver: TransactionUser
  amount: number
  currency: string
  cause: string
  created_at: string
  sender_account_name?: string
  receiver_account_name?: string
}

export interface TransactionResponse {
  data: Transaction[]
  total: number
  page: number
  limit: number
  totalPages: number
  success?: boolean
  error?: string
  searchQuery?: string
}

export interface SearchParams {
  query?: string
  page?: number
  limit?: number
}
