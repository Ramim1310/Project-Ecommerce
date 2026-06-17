# Live Demo:
https://project-ecommerce-five.vercel.app/


# NexusTech

**High-performance hardware. Minimalist software.**

A dark-themed e-commerce platform engineered specifically for PC enthusiasts, custom builders, and gamers. NexusTech prioritizes speed, precision, and an uncompromised dark industrial aesthetic.

## Architecture & Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Frontend** | React.js (v19), Vite | High-speed client-side rendering and blazing fast HMR. |
| **Styling** | Tailwind CSS (v4) | Custom dark industrial theme with zero runtime overhead. |
| **Routing** | React Router DOM | Client-side routing for seamless navigation. |
| **Backend** | Node.js, Express.js | Lightweight, non-blocking REST API architecture. |
| **Database** | PostgreSQL | Highly available relational data storage. |
| **ORM** | Prisma | Type-safe database queries, schema management, and automated migrations. |
| **State Management** | React Context API | Predictable, centralized cart and user state management. |

## Primary Features
- **Dynamic Catalog:** Browse hardware with low-latency search and category filtering.
- **Persistent Cart:** Context-based shopping cart that updates in real-time.
- **Secure Authentication:** JWT-based sessions with OTP (One-Time Password) email verification via Brevo.
- **Integrated Payments:** End-to-end secure checkout pipeline via the SSLCommerz payment gateway.
- **Admin Dashboard:** Dedicated root-access panel for managing products, tracking orders, and viewing store telemetry/analytics (powered by Recharts).

## Core Architectural Modules

- **React Context State:** Cart interactions and user sessions are managed via lightweight, native Context providers rather than heavy third-party libraries.
- **Relational Integrity:** PostgreSQL handles complex relations between Users, Products, Variants, and Orders, ensuring data consistency across the platform.
- **Modular Backend:** The Express backend is split into distinct service modules (Auth, Products, Orders, Admin) for clean separation of concerns and maintainability.
- **Optimized Data Fetching:** The product catalog utilizes server-side pagination to ensure instant load times and reduced database strain, dynamically fetching subsets of hardware specifications as users navigate.

## Engineering Implementations

### Search Debouncing
To provide instant search feedback without overwhelming the backend with queries on every keystroke, the global search bar implements a custom debounce hook. This delays API calls until the user pauses typing (500ms threshold), drastically reducing unnecessary database load while maintaining a highly responsive UI.

### OTP Verification Flow
To ensure account security and validity, the registration and login flows incorporate email-based OTP verification. Brevo handles the dispatch of verification codes, ensuring that only verified users can place orders or access sensitive account details.

### Payment Gateway Integration
The checkout process integrates directly with the SSLCommerz API. The backend manages the secure handshake, payment initiation, and asynchronous callback verification to ensure orders are only marked "PAID" upon cryptographic confirmation from the gateway.

## Local Development & Environment Configuration

### Prerequisites
- Node.js (v18+)
- PostgreSQL instance running locally or remotely

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

Create a `.env` file in the `/backend` directory (you can copy `.env.example`):
```env
PORT=5001
DATABASE_URL="postgresql://user:password@localhost:5432/nexustech"
JWT_SECRET="your_super_secure_jwt_secret"
BREVO_API_KEY="your_brevo_api_key"
BREVO_FROM_EMAIL="onboarding@yourdomain.com"
ADMIN_EMAIL="admin@nexustech.com"
ADMIN_PASSWORD_HASH="$2b$10$g64YjsNekPnPeGznkfK/dOwIvYWuKciYrS/hluOsCWzSqb0rmYnmO"
STORE_ID="sslcommerz_store_id"
STORE_PASS="sslcommerz_store_pass"
ROOT_URL="http://localhost:5001"
FRONTEND_URL="http://localhost:5173"
```

> **Admin Access (Local Development)**
> The `.env` template above includes a default admin account for local testing:
> - **Email**: `admin@nexustech.com`
> - **Password**: `admin123`


Run database migrations and start the development server:
```bash
npx prisma db push
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

- **Input Validation:** Incoming API payloads are checked to prevent malformed data from reaching the database.
- **Secure Password Hashing:** Passwords are cryptographically hashed using bcrypt before persistence.
- **Stateless Authentication:** JSON Web Tokens (JWT) are used for secure session management without server-side memory overhead.
