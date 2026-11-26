# Stock Trading Platform - End-to-End Project Description & Architecture

## 1. Overview: What is this project?
The **Stock Trading Platform** is a full-stack web application designed to simulate real-time stock trading. It provides users with a secure and scalable environment to register, view market data, manage a virtual stock portfolio, and execute simulated trades (Buy/Sell). 

The platform effectively tracks transaction histories, calculates portfolio values, and handles secure user authentication using modern security practices like JWT-based access and refresh tokens.

---

## 2. How It Works (The User Journey)
1. **Onboarding & Authentication:** 
   - A new user registers for an account by providing a username, email, and password. The password is cryptographically hashed before being stored.
   - Upon login, the user receives an `AccessToken` (short-lived, e.g., 15m) and a `RefreshToken` (long-lived, e.g., 7d), enabling secure and persistent sessions without constant logins.

2. **Market Dashboard (Stock Board):** 
   - Users land on a dashboard displaying a list of available stocks (like AAPL, GOOGL, MSFT), along with their current prices, daily high/lows, and percentage changes.

3. **Trading (Buy & Sell):** 
   - Users can execute **Buy** orders to add stocks to their virtual portfolio.
   - Users can execute **Sell** orders to offload stocks they currently hold. 
   - Each action creates a ledger entry in the database tracking the specific transaction (timestamp, quantity, price, type).

4. **Portfolio Management:** 
   - The platform calculates the user's total portfolio value dynamically based on current market prices. 
   - Users can see their individual holdings (average buy price vs. current price) and calculate real-time simulated profits or losses.

---

## 3. The Architecture

The application follows a standard **Client-Server Architecture** utilizing a RESTful API backend communicating with a Single Page Application (SPA) frontend.

### A. Frontend (Client-Side)
- **Framework:** React.js (Bootstrapped with Vite for high performance).
- **Styling:** Tailwind CSS (v4) for rapid, responsive UI component styling.
- **Role:** Handles the presentation layer, client-side routing, local state management, and makes asynchronous HTTP requests (using `fetch` or `axios`) to the backend.
- **Structure:** Resides in the `/frontend` directory. Core logic and UI components are built efficiently, with an `App.jsx` orchestrating the UI.

### B. Backend (Server-Side API)
- **Framework:** Node.js with Express.js.
- **Pattern:** MVC (Model-View-Controller) / Modular Routing pattern.
- **Role:** Acts as the brain of the platform. It handles business logic, database queries, authentication validation, and request routing.
- **Key Features:**
  - **Security:** `bcrypt` for password hashing, `helmet` for secure HTTP headers, `cors` for Cross-Origin Resource Sharing control.
  - **Task Queueing (Optional/Advanced):** `BullMQ` and `ioredis` are configured for handling background jobs asynchronously (e.g., processing trade settlements, updating market data, or sending emails).
  - **Error Handling:** Centralized async error handling pattern ensures the server doesn't crash on unhandled promise rejections.
  
### C. Database (Data Layer)
- **System:** MySQL (Relational Database).
- **Library:** `mysql2` is used in the backend for optimized, promise-based SQL queries.
- **Schema Design:**
  - **Users:** Stores user credentials and profile info.
  - **Stocks:** Acts as the reference table for available market equities.
  - **Portfolio/Holdings:** A junction/mapping table tracking which user owns which stocks and in what quantities.
  - **Transactions:** An append-only ledger tracking every buy/sell event for auditing and history generation.

---

## 4. System Flow & Data Lifecycle

1. **Client Request:** The user clicks "Buy 5 AAPL Stocks". The React frontend sends an HTTP `POST` request to `/api/stocks/buy` with the payload `{ symbol: "AAPL", quantity: 5 }` and the `Authorization: Bearer <AccessToken>` header.
2. **Middleware Intercept:** 
   - The Express router intercepts the request.
   - An authentication middleware verifies the JWT. If expired, the frontend must use the `/refresh-token` endpoint.
   - Rate limiting (if applied) checks if the user is spamming requests.
3. **Controller Logic:** 
   - The `StockController` receives the request.
   - It queries the MySQL DB to ensure the stock exists and calculates the total cost.
4. **Database Transaction:**
   - The system updates the user's Portfolio (adding 5 AAPL).
   - The system creates a new record in the Transactions table marking a "BUY" action.
5. **Response:** The backend responds with a `200 OK` and a JSON payload containing the updated portfolio or a success message.
6. **UI Update:** The React UI updates the user's dashboard to reflect the new holding.

---

## 5. Folder Directory Breakdown

### Backend (`/backend`)
```text
/backend
 ├── src/
 │   ├── controllers/   # Contains business logic (e.g., authController, stockController)
 │   ├── db/            # Database connection configuration (MySQL setup)
 │   ├── middlewares/   # JWT verification, Error handlers, Request validation
 │   ├── routes/        # Express route definitions pointing to controllers
 │   └── utils/         # Helper functions (e.g., token generation, response formatting)
 ├── schema.sql         # SQL script defining database tables
 ├── seed.sql           # SQL script to populate DB with dummy stocks/users
 ├── app.js             # Express app setup (middlewares, route mounting)
 ├── index.js           # Server entry point (starts the HTTP server)
 ├── Dockerfile         # Configuration for containerizing the backend
 └── docker-compose.yml # Orchestration configuration
```

### Frontend (`/frontend`)
```text
/frontend
 ├── src/
 │   ├── assets/        # Static assets (images, icons)
 │   ├── App.jsx        # Main React component containing UI and state logic
 │   ├── App.css        # Global component styles
 │   ├── index.css      # Tailwind directives and base styles
 │   └── main.jsx       # React DOM rendering entry point
 ├── index.html         # Base HTML template
 └── vite.config.js     # Vite bundler configuration
```

## Summary
The Stock Trading Platform is a robust, well-structured, modern web application. It leverages the speed of Node.js and MySQL on the backend, coupled with the reactive and dynamic nature of React and Vite on the frontend, producing a fast and secure virtual trading experience.
