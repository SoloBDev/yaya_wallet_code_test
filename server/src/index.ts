import axios from "axios";
import express from "express";
import crypto from "crypto";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import Joi from "joi";
import "dotenv/config";

const app = express();

// --- Security headers ---
app.use(helmet());

// --- CORS ---
app.use(
  cors({
    origin: [
      "https://yaya-wallet-code-test.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());

// --- Rate limiting (global) ---
const globalLimiter = rateLimit({
  windowMs: 20 * 1000,
  max: 10, 
  message: { error: "Too many requests, try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

const PORT = process.env.PORT || 5000;

const BASE = process.env.YAYA_BASE_URL || "";
const API_KEY = process.env.YAYA_API_KEY || "";
const API_SECRET = process.env.YAYA_API_SECRET || "";
const DEFAULT_LIMIT = Number(process.env.DEFAULT_LIMIT || 5);
const ALLOWED_LIMITS = [3, 5, 7, 10, 15, 20, 25, 50];

if (!API_KEY || !API_SECRET) {
  console.error(
    "[ERROR] Missing YAYA_API_KEY or YAYA_API_SECRET in server/.env"
  );
  process.exit(1);
}

// --- Request signing ---
function signRequest(
  method: string,
  endpoint: string,
  body: any = null
): Record<string, string> {
  const timestamp = Date.now().toString();
  const bodyStr =
    body && Object.keys(body).length > 0 ? JSON.stringify(body) : "";
  const prehash = `${timestamp}${method.toUpperCase()}${endpoint}${bodyStr}`;
  const hmac = crypto.createHmac("sha256", API_SECRET);
  hmac.update(prehash);
  const signature = hmac.digest("base64");
  return {
    "YAYA-API-KEY": API_KEY,
    "YAYA-API-TIMESTAMP": timestamp,
    "YAYA-API-SIGN": signature,
    "Content-Type": "application/json",
  };
}

// --- Validation schemas ---
const paginationSchema = Joi.object({
  p: Joi.number().integer().min(1).default(1),
  limit: Joi.number().valid(...ALLOWED_LIMITS).default(DEFAULT_LIMIT),
});

const searchSchema = Joi.object({
  query: Joi.string().min(1).max(100).required(),
  p: Joi.number().integer().min(1).default(1),
  limit: Joi.number().valid(...ALLOWED_LIMITS).default(DEFAULT_LIMIT),
});

// --- Transactions with pagination ---
app.get("/api/transactions", async (req, res) => {
  try {
    const { value, error } = paginationSchema.validate(req.query);
    if (error) return res.status(400).json({ error: error.message });

    const { p, limit } = value;

    const endpointForSignature = `/api/en/transaction/find-by-user`;
    const headers = signRequest("GET", endpointForSignature);

    const { data } = await axios.get(
      `${BASE}/api/en/transaction/find-by-user`,
      { headers }
    );
    const allTransactions = data.data || [];

    const startIndex = (p - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = allTransactions.slice(startIndex, endIndex);

    res.json({
      data: paginatedData,
      total: allTransactions.length,
      page: p,
      limit,
      totalPages: Math.ceil(allTransactions.length / limit),
      success: true,
    });
  } catch (err: any) {
    res.status(err.response?.status || 500).json({
      error: err.response?.data || err.message,
      success: false,
      data: [],
      total: 0,
      page: 1,
      limit: DEFAULT_LIMIT,
      totalPages: 0,
    });
  }
});

// --- Search transactions ---
app.post("/api/transactions/search", async (req, res) => {
  try {
    const { value, error } = searchSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const { query, p, limit } = value;

    const endpointForSignature = `/api/en/transaction/search`;
    const requestBody = { query };
    const headers = signRequest("POST", endpointForSignature, requestBody);

    const { data } = await axios.post(
      `${BASE}/api/en/transaction/search`,
      requestBody,
      { headers }
    );
    const transactions = data.data || [];

    const startIndex = (p - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = transactions.slice(startIndex, endIndex);

    res.json({
      data: paginatedData,
      total: transactions.length,
      page: p,
      limit,
      totalPages: Math.ceil(transactions.length / limit),
      success: true,
      searchQuery: query,
    });
  } catch (err: any) {
    res.status(err.response?.status || 500).json({
      error: err.response?.data || err.message,
      success: false,
      data: [],
      total: 0,
      page: 1,
      limit: DEFAULT_LIMIT,
      totalPages: 0,
    });
  }
});

// --- Health check ---
app.get("/health", (_req, res) =>
  res.json({ ok: true, timestamp: new Date().toISOString() })
);

app.listen(PORT, () => {
  console.log(
    `🚀 YaYa Wallet API Server listening on http://localhost:${PORT}`
  );
});
