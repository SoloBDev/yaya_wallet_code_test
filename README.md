<div align="center">

# 💰 YaYa Wallet Transaction Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-4.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

<p align="center">
  <strong>A modern, full-stack application for monitoring YaYa Wallet transactions</strong>
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-api-endpoints">API</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-support">Support</a>
</p>

</div>

---

## 🏗️ Project Architecture

```
yaya-wallet-dashboard/
├── 📁 client/          # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── assets/      # assets
│   │   ├── components/  # Reusable UI components
│   │   ├── lib/         # Utilities and API client
│   │   └── types/       # TypeScript definitions
│   └── package.json
├── 📁 server/          # Express backend API
│   ├── src/
│   │   └──index.ts      # API  handlers
│   └── package.json
├── 📄 README.md        # README file
└── 📄 SOLUTION_README.md        # solution file
└── 📄 TESTING_README.md        # testing guide file
```

## ⚠️ Common Issues & Quick Fixes

<details>
<summary><strong>🔧 Click to expand troubleshooting guide</strong></summary>

### 1. Environment Variables Not Loading
```bash
# ❌ Wrong (React/CRA style)
REACT_APP_API_URL=http://localhost:5000

# ✅ Correct (Vite style)
VITE_API_URL=http://localhost:5000
```

### 2. CORS Errors
- Ensure backend `CLIENT_URL` matches frontend URL
- Check server CORS configuration in `server/src/index.ts`

### 3. Ad Blockers Interfering
- Disable ad blockers during development
- Avoid using "ad" in API endpoint paths

### 4. Network Requests Blocked
```javascript
// ❌ Wrong way to access env vars in Vite
const apiUrl = process.env.REACT_APP_API_URL

// ✅ Correct way in Vite
const apiUrl = import.meta.env.VITE_API_URL
```

</details>

## 🚀 Quick Start

### Prerequisites

<div align="center">

| Requirement | Version | Download |
|-------------|---------|----------|
| Node.js | 18+ | [Download](https://nodejs.org/) |
| npm/yarn | Latest | Included with Node.js |

</div>

### 🖥️ Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start development server
npm run dev
```

**Configure `server/.env`:**
# YaYa Wallet API Configuration
```env
YAYA_BASE_URL=https://sandbox.yayawallet.com
YAYA_API_KEY=your_api_key_here
YAYA_API_SECRET=your_api_secret_here
```

# Server Configuration
```env
CLIENT_URL=your_foontend_url || http://localhost:3000
PORT=your_free_port
DEFAULT_LIMIT=your_transaction_Limit_in_per_page
NODE_ENV=development
```

### 🎨 Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start development server
npm run dev
```

**Configure `client/.env`:**
```env
# API Configuration (Note: VITE_ prefix required!)
VITE_API_URL=http://localhost:5000
VITE_ENV=development
```

### 🌐 Access Your Application

<div align="center">

| Service | URL | Status |
|---------|-----|--------|
| 🎨 Frontend | http://localhost:3000 | ![Status](https://img.shields.io/badge/status-running-success) |
| 🖥️ Backend API | http://localhost:5000 | ![Status](https://img.shields.io/badge/status-running-success) |
| 📊 Health Check | http://localhost:5000/health | ![Status](https://img.shields.io/badge/status-healthy-success) |

</div>

## ✨ Features

### 🖥️ Backend Capabilities

<div align="center">

| Feature | Description | Status |
|---------|-------------|--------|
| 🔐 **Authentication** | HMAC-SHA256 request signing | ✅ |
| 🌐 **CORS Support** | Cross-origin resource sharing | ✅ |
| 📄 **Pagination** | Efficient data loading | ✅ |
| 🔍 **Search** | Transaction search functionality | ✅ |
| 🛡️ **Error Handling** | Comprehensive error management | ✅ |
| 📊 **Health Checks** | System monitoring endpoints | ✅ |

</div>

### 🎨 Frontend Capabilities

<div align="center">

| Feature | Description | Status |
|---------|-------------|--------|
| ⚡ **Modern Stack** | React 18 + TypeScript + Vite | ✅ |
| 🎨 **Beautiful UI** | Tailwind CSS + shadcn/ui | ✅ |
| 📱 **Responsive** | Mobile-first design | ✅ |
| 🔍 **Search & Filter** | Advanced transaction filtering | ✅ |
| 📄 **Pagination** | Smooth navigation experience | ✅ |
| 🔄 **Loading States** | Skeleton loaders and spinners | ✅ |
| 🚨 **Error Handling** | User-friendly error messages | ✅ |

</div>

## 📡 API Endpoints

### 🔗 Server Endpoints

```http
GET    /api/transactions?p=1&limit=10    # Get paginated transactions
POST   /api/transactions/search          # Search transactions
GET    /health                           # Health check endpoint
```

### 📋 Request/Response Examples

<details>
<summary><strong>📄 Get Transactions</strong></summary>

```bash
curl -X GET "http://localhost:5000/api/transactions?p=1&limit=10"
```

**Response:**
```json
{
  "data": [...],
  "total": 150,
  "page": 1,
  "limit": 10,
  "totalPages": 15,
  "success": true
}
```

</details>

<details>
<summary><strong>🔍 Search Transactions</strong></summary>

```bash
curl -X POST "http://localhost:5000/api/transactions/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "Surafel", "page": 1, "limit": 10}'
```

</details>

## 🚀 Production Deployment

### 🌐 Environment Configuration

<div align="center">

| Environment | Frontend | Backend |
|-------------|----------|---------|
| **Development** | `http://localhost:3000` | `http://localhost:5000` |
| **Production** | `https://yaya_wallet_code_test.vercel.app` | `https://yaya-wallet-code-test.onrender.com` |

</div>

### 📦 Deployment Platforms

<details>
<summary><strong>▲ Vercel (Frontend)</strong></summary>

1. **Connect Repository**
   ```bash
   # Build settings
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

2. **Environment Variables**
   ```env
   VITE_API_URL=https://your-backend-domain.com
   ```

</details>

<details>
<summary><strong>🎯 Render (Backend)</strong></summary>

1. **Service Configuration**
   ```bash
   # Build settings
   Build Command: npm install
   Start Command: npm start
   ```

2. **Environment Variables**
   ```env
   YAYA_BASE_URL=https://yayawallet.com
   YAYA_API_KEY=your_production_key
   YAYA_API_SECRET=your_production_secret
   CLIENT_URL=https://your-frontend-domain.com
   NODE_ENV=production
   ```

</details>


## 🧪 Development Scripts

### 📁 Server Commands

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm start        # Start production server
npm run clean    # Clean build artifacts
```

### 📁 Client Commands

```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```


## 📞 Support & Contact

<div align="center">

### 🆘 Need Help?

| Issue Type | Contact | Response Time |
|------------|---------|---------------|
| 🐛 **Bug Reports** | [Create Issue](https://github.com/yaya_wallet_code_test/issues) | 24 hours |
| 💡 **Feature Requests** | [Discussions](https://github.com/yaya_wallet_code_test/discussions) | 48 hours |
| 🔧 **Technical Support** | solomon.belayu@gmail.com | 24 hours |


</div>

---

<div align="center">


### ⭐ Show Your Support

If this project helped you, please consider giving it a ⭐ on GitHub!

**Made with ❤️ by Solomon Belay**

</div>



This README now serves as both a technical guide and a professional project showcase that is written to describe what i did for coding test purpose.