// server/index.ts

import axios from "axios"
import express from "express"
import crypto from "crypto"
import cors from "cors"
import "dotenv/config"

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
)

app.use(express.json())

const PORT = process.env.PORT || 5000

const BASE = process.env.YAYA_BASE_URL || ""
const API_KEY = process.env.YAYA_API_KEY || ""
const API_SECRET = process.env.YAYA_API_SECRET || ""
const DEFAULT_LIMIT = Number(process.env.DEFAULT_LIMIT || 5)
const ALLOWED_LIMITS = [3, 5, 7, 10, 15, 20, 25, 50]

if (!API_KEY || !API_SECRET) {
  console.error("[ERROR] Missing YAYA_API_KEY or YAYA_API_SECRET in server/.env")
  process.exit(1)
}

/**
 * Helper: Sign a request according to YaYa Wallet spec
 */
function signRequest(method: string, endpoint: string, body: any = null): Record<string, string> {
  const timestamp = Date.now().toString()
  const bodyStr = body && Object.keys(body).length > 0 ? JSON.stringify(body) : ""
  const prehash = `${timestamp}${method.toUpperCase()}${endpoint}${bodyStr}`
  const hmac = crypto.createHmac("sha256", API_SECRET)
  hmac.update(prehash)
  const signature = hmac.digest("base64")
  return {
    "YAYA-API-KEY": API_KEY,
    "YAYA-API-TIMESTAMP": timestamp,
    "YAYA-API-SIGN": signature,
    "Content-Type": "application/json",
  }
}

/**
 * GET /api/transactions?p=1&limit=10
 * Fetch transactions and apply server-side pagination
 */
app.get("/api/transactions", async (req, res) => {
  try {
    const p = Number(req.query.p) || 1
    const requestedLimit = Number(req.query.limit) || DEFAULT_LIMIT
    const limit = ALLOWED_LIMITS.includes(requestedLimit) ? requestedLimit : DEFAULT_LIMIT

    const endpointForSignature = `/api/en/transaction/find-by-user`
    const headers = signRequest("GET", endpointForSignature)

    const { data } = await axios.get(`${BASE}/api/en/transaction/find-by-user`, { headers })
    const allTransactions = data.data || []

    // Server-side pagination
    const startIndex = (p - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = allTransactions.slice(startIndex, endIndex)

    res.json({
      data: paginatedData,
      total: allTransactions.length,
      page: p,
      limit,
      totalPages: Math.ceil(allTransactions.length / limit),
      success: true,
    })
  } catch (err: any) {
    res.status(err.response?.status || 500).json({
      error: err.response?.data || err.message,
      success: false,
      data: [],
      total: 0,
      page: 1,
      limit: DEFAULT_LIMIT,
      totalPages: 0,
    })
  }
})

/**
 * POST /api/transactions/search
 * Body: { query: string, p?: number, limit?: number }
 * Search by sender, receiver, ID, or cause and paginate results
 */
app.post("/api/transactions/search", async (req, res) => {
  try {
    const { query = "", p = 1, limit: requestedLimit = DEFAULT_LIMIT } = req.body || {}
    const limit = ALLOWED_LIMITS.includes(requestedLimit) ? requestedLimit : DEFAULT_LIMIT

    const endpointForSignature = `/api/en/transaction/search`
    const requestBody = { query }
    const headers = signRequest("POST", endpointForSignature, requestBody)

    const { data } = await axios.post(`${BASE}/api/en/transaction/search`, requestBody, { headers })
    const transactions = data.data || []

    // Server-side pagination
    const startIndex = (p - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = transactions.slice(startIndex, endIndex)

    res.json({
      data: paginatedData,
      total: transactions.length,
      page: p,
      limit,
      totalPages: Math.ceil(transactions.length / limit),
      success: true,
      searchQuery: query,
    })
  } catch (err: any) {
    res.status(err.response?.status || 500).json({
      error: err.response?.data || err.message,
      success: false,
      data: [],
      total: 0,
      page: 1,
      limit: DEFAULT_LIMIT,
      totalPages: 0,
    })
  }
})

/**
 * Health check
 */
app.get("/health", (_req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }))

app.listen(PORT, () => {
  console.log(`🚀 YaYa Wallet API Server listening on http://localhost:${PORT}`)
  console.log(`📊 Dashboard available at ${process.env.CLIENT_URL || "http://localhost:51730"}`)
})
