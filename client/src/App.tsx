"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Alert, AlertDescription } from "./components/ui/alert"
import { Badge } from "./components/ui/badge"
import TransactionTable from "./components/TransactionTable"
import SearchBar from "./components/SearchBar"
import Pagination from "./components/Pagination"
import { fetchTransactions, searchTransactions } from "./lib/api"
import type { Transaction, TransactionResponse } from "./types/transaction"
import { Wallet, TrendingUp, TrendingDown, RefreshCw, AlertCircle } from "lucide-react"

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const loadTransactions = async (page = 1, limit = itemsPerPage) => {
    try {
      setLoading(true)
      setError(null)

      let response: TransactionResponse

      if (searchQuery) {
        setIsSearching(true)
        response = await searchTransactions(searchQuery, { page, limit })
      } else {
        setIsSearching(false)
        response = await fetchTransactions({ page, limit })
      }

      if (response.success !== false) {
        setTransactions(response.data)
        setTotalPages(response.totalPages)
        setTotalTransactions(response.total)
        setCurrentPage(response.page)
      } else {
        throw new Error(response.error || "API request failed")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      console.error("Failed to load transactions:", err)
    } finally {
      setLoading(false)
    }
  }

  
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    loadTransactions(page, itemsPerPage)
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
    loadTransactions(1, newItemsPerPage)
  }


  useEffect(() => {
    loadTransactions(currentPage, itemsPerPage)
  }, [searchQuery, itemsPerPage])

  const getTransactionStats = () => {
    const incoming = transactions.filter((t) => t.receiver === "current_user" || t.sender === t.receiver).length
    const outgoing = transactions.filter((t) => t.sender === "current_user" && t.sender !== t.receiver).length

    return { incoming, outgoing, total: transactions.length }
  }

  const stats = getTransactionStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center space-x-6 mb-2 sm:mb-6 lg:mb-8 xl:mb-10 2xl:mb-14">
            <div className="w-40 h-auto flex items-center justify-center">
              <img src="./logo.svg" alt="yaya wallet svg image" className="w-auto h-auto" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl text-end sm:text-start sm:text-3xl font-bold text-gray-900 pr-8"> Dashboard</h1>
              <p className="hidden sm:block text-gray-600 ">Monitor your transaction history with advanced controls</p>
            </div>
            
          </div>
          <p className="block sm:hidden text-gray-600 !mb-6">Monitor your transaction history with advanced controls</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 sm:gap-4 mb-6">
            <Card className="bg-gradient-to-r from-blue-500/60 to-blue-600/40 text-white shadow-lg hover:shadow-xl transition-shadow duration-200 scale-88 sm:scale-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Transactions</p>
                    <p className="text-2xl font-bold">{totalTransactions}</p>
                  </div>
                  <Wallet className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500/60 to-green-600/80 text-white shadow-lg hover:shadow-xl transition-shadow duration-200 scale-88 sm:scale-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Incoming</p>
                    <p className="text-2xl font-bold">{stats.incoming}</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-500/60 to-red-600/80 text-white shadow-lg hover:shadow-xl transition-shadow duration-200 scale-88 sm:scale-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Outgoing</p>
                    <p className="text-2xl font-bold">{stats.outgoing}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-red-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500/60 to-purple-600/80 text-white shadow-lg hover:shadow-xl transition-shadow duration-200 scale-88 sm:scale-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Per Page</p>
                    <p className="text-2xl font-bold">{itemsPerPage}</p>
                  </div>
                  <RefreshCw className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Search Transactions</span>
              {isSearching && (
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700">
                  Search Results
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SearchBar onSearch={handleSearch} onClear={handleClearSearch} isLoading={loading} />
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 shadow-lg">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Transactions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{isSearching ? `Search Results for "${searchQuery}"` : "Recent Transactions"}</span>
              <Badge variant="outline" className="bg-gradient-to-r from-gray-50 to-gray-100">
                {totalTransactions} total
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionTable transactions={transactions} isLoading={loading} currentUser="surafelaraya" />

            {/* Enhanced Pagination */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={loading}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                totalItems={totalTransactions}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
