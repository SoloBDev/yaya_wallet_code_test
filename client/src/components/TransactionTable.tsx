import type { Transaction } from "../types/transaction"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react"
import { formatDistanceToNow, isValid } from "date-fns"

interface TransactionTableProps {
  transactions: Transaction[]
  currentUser?: string
  isLoading?: boolean
}



export default function TransactionTable({
  transactions,
  currentUser = "YaYa PII SC",
  isLoading = false,
}: TransactionTableProps) {

  const getTransactionType = (transaction: Transaction) => {
  // Top-up transactions (same sender and receiver) are incoming
  if (transaction.sender.name === transaction.receiver.name) {
    return "topup"
  }
  
  // If receiver is current user, it's incoming
  if (transaction.receiver.name === currentUser) {
    return "incoming"
  }
  
  // If sender is current user, it's outgoing
  if (transaction.sender.name === currentUser) {
    return "outgoing"
  }
  
  // Default to outgoing for other cases
  return "outgoing"
}

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "incoming":
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />
      case "outgoing":
        return <ArrowUpRight className="w-4 h-4 text-red-600" />
      case "topup":
        return <RefreshCw className="w-4 h-4 text-blue-600" />
      default:
        return <ArrowUpRight className="w-4 h-4 text-gray-600" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "incoming":
        return "border-l-green-500 bg-green-50/50"
      case "outgoing":
        return "border-l-red-500 bg-red-50/50"
      case "topup":
        return "border-l-blue-500 bg-blue-50/50"
      default:
        return "border-l-gray-500 bg-gray-50/50"
    }
  }

  const displayName = (value: string | {name?: string; account?: string} | undefined) => {
    if(!value) return "Unknown"
    if (typeof value === "string") return value
    return value.name || value.account || "Unknown"
  }

const formatTransactionDate = (timestamp?: number) => {
  if (!timestamp) return "Unknown date";
  
  try {
    // Convert Unix timestamp to Date object
    const date = new Date(timestamp * 1000);
    if (!isValid(date)) return "Invalid date";
    
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="text-gray-500">
            <RefreshCw className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No transactions found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => {
        const type = getTransactionType(transaction)
        const icon = getTransactionIcon(type)
        const colorClass = getTransactionColor(type)

        return (
          <Card
            key={transaction.id}
            className={`border-l-4 ${colorClass} hover:shadow-lg transition-all duration-200 hover:scale-[1.01] sm:mb-6`}
          >
            <CardContent className="p-1 sm:p-2 2xl:p-4 sm:!px-4 ">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:gap-1">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 hidden sm:block">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-center ">
                      {icon}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 sm:truncate 2xl:text-base">ID: {transaction.id}</p>
                      <Badge variant="outline" className="text-xs">
                        {type === "topup" ? "Incoming" : type === "incoming" ? "Incoming" : "Outgoing"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">From:</span>{" "}
                        {transaction.sender_account_name || displayName(transaction.sender)}
                      </div>
                      <div>
                        <span className="font-medium">To:</span>{" "}
                        {transaction.receiver_account_name || displayName(transaction.receiver)}
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium">Cause:</span> {transaction.cause}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end space-y-2">
                  <div
                    className={`text-lg font-bold ${
                      type === "incoming" || type === "topup" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {type === "incoming" || type === "topup" ? "+" : "-"}
                    {transaction.amount} {transaction.currency}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTransactionDate(Number(transaction.created_at))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
