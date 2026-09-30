Inventory management will be added.

Here is the exact translation to English with no additions or omissions:

```markdown
# 🍹 Drink Order Queue System

A beverage order queue management and processing system built with **Node.js**, **TypeScript**, **Express**, and **RabbitMQ**.

The project uses an Event-Driven Architecture separated into independent services (Producer and Consumer/Analytics), ensuring asynchronous and resilient order processing.

> **Note:** Redis (Upstash) support is configured in the code, but currently **commented out**. If you wish to add cache persistence or Pub/Sub, simply uncomment the relevant lines in the shared services folder.

---

## 🛠️ Technologies Used

- **Node.js** (v20.19.4)
- **TypeScript**
- **Express.js**
- **RabbitMQ** (Messaging and Queues via Docker)
- **amqplib** (Official RabbitMQ driver)
- **tsx** (TypeScript execution and live-reload in development)
- *(Optional)* **Redis / ioredis** (Disabled/Commented out)

---

## 📋 Prerequisites

Before starting, make sure you have installed in your environment:

* Docker or Docker Desktop (to run the RabbitMQ container)
* NVM (Node Version Manager)

---

## 🚀 How to Run the Project

### 1. Select the Node.js Version

To avoid package or TypeScript type incompatibilities, make sure to use Node.js version **20.19.4**:

```bash
nvm use 20.19.4


```

> *If you don't have this version installed yet, run `nvm install 20.19.4` first.*

### 2. Install Dependencies

In the project root, install the project packages:

```bash
npm install


```

### 3. Start the RabbitMQ Container

Start the RabbitMQ container with the management dashboard enabled:

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management


```

* **AMQP Port (Application Communication):** `5672`
* **RabbitMQ Management Dashboard (Browser):** [http://localhost:15672](http://localhost:15672) (Default credentials: `guest` / `guest`)

### 4. Run the Servers

Start the application in development mode (bringing up the Producer and Consumer/Analytics):

You must run the two independent services in separate tabs/terminals or via a unified script:

Fulfillment Service (Producer/Order API):

Bash
npx tsx watch src/services/fulfillment/index.js

Analytics Service (Consumer/Worker):

Bash
npx tsx watch src/services/analytics/index.ts

```bash
npm run dev


```

---

## 📐 System Architecture

1. **Producer Service (Port 3000):** Exposes the HTTP API with the route `POST /order`, which receives the beverage order and sends it directly to the `analytics` queue in RabbitMQ.
2. **Analytics / Consumer Service (Port 3001):** Listens to the RabbitMQ queue in the background.

---

## 🧪 How to Test (Create Order)

You can send a `POST` request to simulate a new order arriving in the queue:

```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -d '{
    "drinkOrder": "latte",
    "cost": 12.50,
    "customer": "Elber"
  }'


```