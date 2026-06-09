# NexusTech

**Zero bottlenecking from browse to checkout.**

A high-performance, dark-themed e-commerce platform for PC enthusiasts, custom builders, and gamers. NexusTech prioritizes speed, precision, and an uncompromised dark industrial aesthetic.

## Architecture & Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Frontend** | React.js, Vite | High-speed client-side rendering and blazing fast HMR. |
| **Styling** | Tailwind CSS | Custom dark industrial theme with zero runtime overhead. |
| **Icons** | Lucide Icons | Clean, consistent vector iconography. |
| **Backend** | Node.js, Express.js | Lightweight, non-blocking REST API architecture. |
| **Database** | Neon DB (Serverless PostgreSQL) | Highly available relational data storage with instant branching. |
| **ORM** | Prisma | Type-safe database queries and automated migrations. |
| **State Management** | Context API / Redux Toolkit | Predictable, centralized cart and user state management. |

## Primary Features
- **Dynamic inventory browsing** with low-latency search.
- **Advanced multi-attribute filtering** (by chipset, socket, socket type, wattage).
- **Persistent shopping cart** across sessions.
- **Secure checkout pipeline** with payment gateway integration.
- **Live stock tracking** to prevent overselling.

## Core Architectural Modules

- **Client-Side State Caching:** Aggressive local caching of cart interactions to ensure immediate UI responsiveness without waiting on network roundtrips.
- **Optimized Query Indexing:** Critical PostgreSQL tables (products, categories, orders) are indexed to deliver lightning-fast catalog searches and complex multi-attribute filtering.
- **Dynamic Specification Rendering:** Hardware specifications are handled via a flexible schema, allowing the UI to dynamically render product attributes without hardcoding component types.
- **Persistent Cart Pipeline:** Cart state is securely synchronized between local storage and the backend database, ensuring session continuity across devices.

## Engineering Challenges & Solutions

### Challenge 1: Handling Race Conditions in Inventory Management
In a high-demand hardware market, multiple users attempting to purchase the last available unit (e.g., an RTX 5090) simultaneously can result in overselling.
**Solution:** We utilize strict database transactions within Prisma. Inventory checks and decrements are wrapped in atomic transactions. If the requested quantity exceeds the available stock during the commit phase, the transaction rolls back, and the client is immediately notified, guaranteeing inventory integrity.

### Challenge 2: Heavy Asset & Image Optimization
High-resolution hardware imagery is notoriously heavy and can easily degrade Lighthouse performance scores.
**Solution:** The application enforces modern image formats (WebP/AVIF) and implements native lazy-loading for all non-critical assets below the fold. Product catalog grids utilize placeholder blurring and suspense boundaries to maintain a layout shift score (CLS) of near zero while images fetch asynchronously.

## Local Development & Environment Configuration

### Prerequisites
- Node.js (v18+)
- PostgreSQL instance (or Neon DB connection string)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/nexustech.git
cd nexustech
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `/backend` directory:
```env
PORT=5001
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
JWT_SECRET="your_super_secure_jwt_secret"
```

Run database migrations and start the server:
```bash
npx prisma migrate dev
npm run dev
```

### 3. Frontend Setup
In a new terminal, navigate to the frontend directory:
```bash
cd frontend
npm install
```

Create a `.env` file in the `/frontend` directory:
```env
VITE_API_URL="http://localhost:5001/api"
```

Start the Vite development server:
```bash
npm run dev
```

## Performance & Security Best Practices

- **Database Connection Pooling:** Utilizes connection pooling to maintain stable database connections during high traffic spikes, preventing connection exhaustion.
- **Input Sanitization:** All incoming API payloads are strictly validated and sanitized to mitigate SQL injection (SQLi) and Cross-Site Scripting (XSS) attacks.
- **Secure Password Hashing:** Passwords are cryptographically hashed using bcrypt with an appropriate work factor before persistence. JSON Web Tokens (JWT) are used for stateless, secure session management.
