"use client"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { ChevronLeft, ChevronRight, MoreHorizontal, Settings, Eye } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
  itemsPerPage: number
  onItemsPerPageChange: (itemsPerPage: number) => void
  totalItems: number
}

const ITEMS_PER_PAGE_OPTIONS = [3, 5, 7, 10]

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
}: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

   const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  if (totalPages <= 1 && totalItems <= Math.min(...ITEMS_PER_PAGE_OPTIONS)) {
    return null
  }


  return (
    <div className="flex flex-col space-y-4 md:flex-row items-center sm:justify-between sm:space-y-0 gap-2 sm:gap-4 md:gap-1">
      {/* Items per page selector */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Settings className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Show</span>
        </div>

        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(Number(value))}
          disabled={isLoading}
        >
          <SelectTrigger className="w-24 h-9 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:from-blue-100 hover:to-purple-100 transition-all duration-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="min-w-[120px]">
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option.toString()} className="cursor-pointer">
                <div className="flex items-center space-x-2">
                  <Eye className="w-3 h-3 text-blue-500" />
                  <span>{option}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="hidden md:block text-xs  xl:text-sm text-gray-600">views per page</span>
      </div>

      {/* Results info */}
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 text-green-700">
          <span className="font-medium">
            {startItem}-{endItem} of {totalItems}
          </span>
        </Badge>
      </div>

      {/* Page navigation */}
      {totalPages > 1 && (
        <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isLoading}
        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
      >
        <ChevronLeft className="w-4 h-4" />
         <span className="hidden sm:inline ml-1">Previous</span>
      </Button>

      <div className="flex items-center space-x-1">
        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <div className="sm:px-3 sm:py-2">
                <MoreHorizontal className="sm:w-4 sm:h-4 text-gray-400" />
              </div>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                disabled={isLoading}
                className={`min-w-[40px] transition-all duration-200 ${
                      currentPage === page
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                        : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300"
                    }`}
              >
                {page}
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isLoading}
         className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
      >
        <span className="hidden sm:inline mr-1">Next</span>
        <ChevronRight className="w-4 h-4" />
      </Button>
      </div>
      )}
    </div>
  )
}
