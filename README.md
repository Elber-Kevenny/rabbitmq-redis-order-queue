```markdown
# 🍹 Beverage Order Queue & Inventory Management System

A real-time beverage order queue management, processing, and inventory control system built with **Node.js**, **TypeScript**, **Express**, **RabbitMQ**, and **Redis**.

The project adopts an Event-Driven Architecture (EDA) split into independent microservices/modules (Fulfillment, Analytics, and HTTP Dashboard), ensuring asynchronous processing, resilience, and low latency in inventory management.

---

## 🛠️ Technologies Used

- **Node.js** (v20.19.4) & **TypeScript**
- **Express.js** (v5) — Routing and RESTful API
- **RabbitMQ** (via Docker) — Messaging, messaging channels, and order queue management
- **Redis** (via Docker) — Fast in-memory storage for instant queries and atomic inventory updates
- **Handlebars (HBS)** — View rendering engine for the Dashboard and Order Interface
- **Vanilla JavaScript (DOM Manipulation)** — Dynamic DOM manipulation on the client interface/dashboard
- **amqplib** — Official RabbitMQ communication driver
- **tsx** — Execution and live-reload for TypeScript files in development environment

---

## 📋 Prerequisites

Before starting, make sure you have installed in your environment:

* **Docker Desktop / Docker** (to run RabbitMQ and Redis containers)
* **Node.js** (version 20.19.4 or higher) and **NVM**

---

## 🐳 Docker Containers Setup

Start the **RabbitMQ** (with management dashboard) and **Redis** containers for fast inventory management:

```bash
nvm use 
# RabbitMQ Container
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# Redis Container
docker run -d --name redis-inventory -p 6379:6379 redis:latest

```

* **RabbitMQ Dashboard (Browser):** [http://localhost:15672](http://localhost:15672) *(Default credentials: `guest` / `guest`)*
* **Redis Port:** `6379`

---

## 🚀 How to Run the Project

### 1. Install Dependencies

In the project root directory, install the packages:

```bash
npm install

```

### 2. Run the Services (3 Terminals)

Since the application is separated into independent services, open **3 parallel terminals** and run the scripts using `npm run`:

**Terminal 1 — Main Server / Index:**

```bash
npm run dev
go to http://localhost:3000

```

**Terminal 2 — Fulfillment Service (Producer/Order API):**

```bash
npm run ful

```

**Terminal 3 — Analytics Service (Consumer/Worker):**

```bash
npm run analytics

```

> **Scripts configured in `package.json`:**
> * `"dev"`: `npx tsx watch src/index.ts`
> * `"ful"`: `npx tsx watch src/services/fulfillment/index.ts`
> * `"analytics"`: `npx tsx watch src/services/analytics/index.ts`
> 
> 

---

## 📐 System Architecture

1. **Centralized Exception Handling:** The application uses the custom `ApiError` class with static methods (`badRequest`, `notFound`, etc.) and a globally registered `errorMiddleware` in Express. All errors thrown inside controllers are intercepted and formatted into standardized JSON responses.
2. **Order Queue with RabbitMQ:** Purchase requests arrive via API/UI and are queued in RabbitMQ channels for asynchronous consumption by the Analytics service.
3. **Fast Inventory with Redis:** Stock counting and updating rely on Redis as an in-memory data store, allowing instant queries and atomic operations without I/O bottlenecks.
4. **Graphical Interface with Handlebars:**

* Order placement page (`orders.hbs`) and Dashboard (`dashBoard.hbs`).
* Front-end JavaScript directly manipulates the DOM to update queue states, loadings, and data display without reloading the page.

---

## 🧪 Testing the Order API

You can place an order via the Handlebars interface or by sending a `POST` request:

```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -d '{
    "drinkOrder": "latte",
    "quantity": 2,
    "customer": "Elber"
  }'

```

```

```