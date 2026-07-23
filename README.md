# 🚀 JourneyMate AI – Intelligent Travel Planning System

> **Tagline**: An AI-powered travel planning platform that creates personalized travel itineraries, estimates travel budgets, recommends attractions, displays weather information, optimizes routes, and tracks travel expenses.

---

## 🌟 Overview & System Highlights

**JourneyMate AI** is an enterprise-grade full-stack web application designed using Clean Architecture, SDLC best practices, Agile Scrum principles, Design Patterns, and modern DevOps tools.

### Key Capabilities:
- 🔐 **Authentication & Security**: Spring Security + JWT authentication, BCrypt password encryption, role-based access control (`ROLE_USER`, `ROLE_ADMIN`).
- 🤖 **AI Itinerary Generator**: Automated day-wise itinerary generation with activity timing, curated dining suggestions, and attraction picks.
- 💰 **Budget & Expense Tracker**: Real-time spending tracker categorized into Hotel, Transport, Food, Activities, and Miscellaneous with interactive Recharts.
- 🌤️ **Live Weather & Map Integration**: Real-time city weather forecasts and OpenStreetMap location routing widget.
- 📄 **PDF Itinerary Exporter**: 1-click export of complete trip schedules to PDF document format.
- 💬 **AI Assistant Chatbot**: Floating conversational travel companion widget.
- 🛡️ **Admin Dashboard**: System metrics, user management, and platform budget analytics.
- 🧰 **Travel Tools**: Packing checklist manager & live currency converter.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, React Router v7, Axios, Recharts, Framer Motion, Lucide Icons |
| **Backend** | Java 21, Spring Boot 3, Spring Security, JWT, Spring Data JPA, Hibernate, Apache PDFBox, Maven |
| Database | PostgreSQL (Render Production) / Embedded H2 Database (Instant Local Dev) |
| DevOps & CI/CD | GitHub Actions, Render (Native Java), Vercel |
| Testing | JUnit 5, Mockito, Selenium WebDriver, Apache JMeter |

---

## 📁 Repository Structure

```
d:\trip planner\
├── backend\                    # Spring Boot 3 Java 21 Backend API
│   ├── src\main\java\com\journeymate\
│   │   ├── config\             # SecurityConfig, CorsConfig
│   │   ├── controller\         # REST Controllers (Auth, User, Trip, Expense, Weather, Rec, Admin, AI)
│   │   ├── dto\                # Request / Response DTOs
│   │   ├── entity\             # JPA Entities (User, Trip, ItineraryItem, Expense, etc.)
│   │   ├── exception\          # GlobalExceptionHandler
│   │   ├── repository\         # Spring Data JPA Interfaces
│   │   ├── security\           # JwtUtils, UserDetailsServiceImpl, UserPrincipal
│   │   └── service\            # Service Interfaces & Implementations
│   └── pom.xml
│
├── frontend\                   # React 19 + Vite + Tailwind CSS Application
│   ├── src\
│   │   ├── components\         # Navbar, Footer, StatCard, InteractiveMap, AiChatDrawer, SkeletonLoader
│   │   ├── context\            # AuthContext, ThemeContext, CurrencyContext
│   │   ├── pages\              # Dashboard, TripPlanner, ItineraryView, ExpenseTracker, Weather, Admin, etc.
│   │   ├── services\           # Axios API services with mock fallback state
│   │   └── index.css           # Design Tokens & Glassmorphism styles
│   ├── vercel.json             # Vercel deployment rewrites
│   └── vite.config.js
│
├── render.yaml                 # Render Blueprint for Native Java Web Service + PostgreSQL
│
├── testing\                    # Automated Tests
│   ├── jmeter\journeymate_load_test.jmx
│   └── selenium\E2ETestSuite.java
│
└── docs\                       # Detailed Technical Documentation
    ├── API_DOCUMENTATION.md
    ├── DATABASE_SCHEMA.md
    └── RENDER_DEPLOYMENT_GUIDE.md # Native Render + Vercel Deployment Guide
```

---

## ⚡ Quick Start Guide

### Option 1: Run Frontend Locally (Instant Demo Mode)

```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The app runs seamlessly out-of-the-box with built-in mock fallback data!

### Option 2: Run Full-Stack Spring Boot + React Locally

```bash
# Terminal 1: Backend
cd backend
mvn spring-boot:run

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

### Option 3: Deploy to Production (Render + Vercel)

- **Frontend**: Deploy on **Vercel** (`frontend` directory).
- **Backend API & Database**: Deploy on **Render** using native Java runtime (`render.yaml`).
- Refer to [RENDER_DEPLOYMENT_GUIDE.md](file:///d:/trip%20planner/docs/RENDER_DEPLOYMENT_GUIDE.md) for step-by-step instructions.

---

## 🔑 Demo Login Credentials

- **Standard User**: Username: `demo_user` | Password: `user123`
- **Administrator**: Username: `admin` | Password: `admin123` (Admin Code: `ADMIN123`)

---

## 📜 Documentation & Specifications

- 📘 [API Documentation](file:///d:/trip%20planner/docs/API_DOCUMENTATION.md)
- 🗄️ [Database Schema & ER Diagram](file:///d:/trip%20planner/docs/DATABASE_SCHEMA.md)
- 🚀 [Deployment Guide](file:///d:/trip%20planner/docs/DEPLOYMENT_GUIDE.md)
