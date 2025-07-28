# 🥡 LastBite - A Web Platform for Reducing Food Waste

![Language](https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript)
![Next.js](https://img.shields.io/badge/-Next.js-000?logo=nextdotjs)
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/-Prisma-2D3748?logo=prisma)
![Stripe](https://img.shields.io/badge/-Stripe-6772e5?logo=stripe&logoColor=white)
![Google Maps](https://img.shields.io/badge/-Google%20Maps-4285F4?logo=googlemaps&logoColor=white)


> 🎓 This project was developed as a **Bachelor's Thesis** at the **Faculty of Mathematics and Computer Science, Ovidius University of Constanța**.

[![Click to watch the LastBite Demo Video(https://github.com/oanacristina21/LastBite-A-Web-Application-for-a-Sustainable-Food-System/issues/1#issue-3270052384)](https://youtu.be/qXYsH64pEyA)

---

## 🎯 Project Objective

**LastBite** is an innovative digital platform designed to combat food waste by enabling users to discover and purchase perfectly edible food nearing its expiration date at discounted prices.

The platform connects restaurants, bakeries, and grocery stores with surplus food to consumers looking for great deals — promoting a **circular economy** and responsible resource usage.

---

## ✨ Core Features

### 👤 For Clients
- 🔐 **Account Creation & Authentication** — Secure sign-up/login
- 🛒 **Offer Discovery** — Filter by price, category, dietary preferences
- 📍 **Geolocation** — Google Maps integration for nearby offers
- 💳 **Ordering System** — Shopping cart, checkout, Stripe integration
- 🔔 **Notifications** — In-app + email updates (via Nodemailer)
- 📈 **Dashboard** — View order history, leave reviews

### 🍽️ For Restaurants
- 📦 **Inventory Management** — Add/edit products, manage discounts and stock
- 🧾 **Order Management** — View/update order statuses
- ✅ **Pickup Validation** — QR code-based order verification
- ⭐ **Feedback Tools** — Read and respond to customer reviews

### 🛠️ For Administrators
- 📊 **Admin Panel** — Full CRUD access to users, restaurants, products, and categories

---

## 🛠️ Tech Stack & Architecture

| Category        | Technology                         | Purpose                                |
|----------------|-------------------------------------|----------------------------------------|
| **Frontend**    | Next.js, React, TypeScript, Tailwind CSS | Fast, interactive, typed UI development |
| **Backend**     | Node.js, Express.js                | RESTful API development                |
| **Database**    | Microsoft SQL Server + Prisma ORM  | Relational storage with safe querying  |
| **Authentication** | NextAuth.js + JWT              | Session and route protection           |
| **External APIs** | Stripe, Google Maps, Nodemailer | Payments, maps, and email functionality |
| **Docs & Tests** | Swagger (OpenAPI), Jest           | API documentation and unit testing     |

> 📐 The project follows a **Client-Server** architecture and uses the **MVC pattern** for structure and maintainability.

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js v18 or newer
- npm or yarn
- Microsoft SQL Server (running locally or remotely)

---

### 📦 1. Clone the Repository

```bash
git clone https://github.com/oanacristina21/LastBite-A-Web-Application-for-a-Sustainable-Food-System.git
cd LastBite-A-Web-Application-for-a-Sustainable-Food-System
```
---

---
### ⚙️ 3. Set Up Environment Variables

Create a `.env` file in the root directory of the project and add the following:

```env
# Database
DATABASE_URL="sqlserver://USER:PASSWORD@HOST:PORT;database=DB_NAME;trustServerCertificate=true"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-for-jwt"
NEXTAUTH_URL="http://localhost:3000"

# Google Maps API
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"

# Nodemailer
EMAIL_USER="your-email-address@gmail.com"
EMAIL_PASS="your-email-app-password"

# App URL
APP_URL="http://localhost:3000"
```
---

### 🧱 4. Apply Database Migrations

Run the following command to apply the Prisma schema and create the necessary tables in your SQL Server database:

```bash
npx prisma migrate dev
```


---

### ▶️ 5. Start the Development Server

Once everything is configured, start the development server:

```bash
npm run dev
```

---

## 📄 API Documentation

The API is documented using **Swagger (OpenAPI)**. Once the app is running locally, visit the following URL to access the interactive documentation:

```bash
http://localhost:3000/api-docs
```

You can explore all endpoints, inspect request/response formats, and test the API directly from your browser.

## 👨‍💻 Developed by

**Mihail Cristina-Ioana**

> If you found this project helpful or inspiring, feel free to ⭐ star the repository and connect with me on [LinkedIn](https://www.linkedin.com/in/cristina-mihail-29abb1263/).













