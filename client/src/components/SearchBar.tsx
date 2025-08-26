"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
  onClear: () => void
  isLoading?: boolean
  placeholder?: string
}

export default function SearchBar({
  onSearch,
  onClear,
  isLoading = false,
  placeholder = "Search by sender, receiver, cause, or transaction ID...",
}: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  const handleClear = () => {
    setQuery("")
    onClear()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
          disabled={isLoading}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <Button type="submit" disabled={isLoading || !query.trim()}>
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </form>
  )
}
