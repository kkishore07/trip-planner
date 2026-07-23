# 🌐 Deploying JourneyMate AI: Native Java Backend on Render + Frontend on Vercel

This guide provides step-by-step instructions to deploy your **Spring Boot 3 (Java 21) Backend** natively (without Docker) and **PostgreSQL Database** on [Render](https://render.com), and connect them to your **Vercel** frontend.

---

## 🏗️ Architecture Overview

- **Frontend**: Hosted on **Vercel** (`https://<your-app>.vercel.app`)
- **Backend API**: Native Java Spring Boot service on **Render** (`https://<your-backend>.onrender.com`)
- **Database**: Managed **PostgreSQL** database on **Render**.

---

## 📑 Quick Table of Contents

1. [Step 1: Deploy PostgreSQL Database on Render](#step-1-deploy-postgresql-database-on-render)
2. [Step 2: Deploy Spring Boot Backend on Render (Native Java)](#step-2-deploy-spring-boot-backend-on-render-native-java)
3. [Step 3: Connect Vercel Frontend to Render Backend](#step-3-connect-vercel-frontend-to-render-backend)
4. [Step 4: Verification & Testing](#step-4-verification--testing)

---

## 🐘 Step 1: Deploy PostgreSQL Database on Render

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **PostgreSQL**.
3. Fill in the parameters:
   - **Name**: `journeymate-db`
   - **Database**: `journeymatedb`
   - **User**: `journeymate_user`
   - **Region**: Choose closest to your users (e.g., *Singapore* or *US East*).
   - **Instance Type**: Select **Free**.
4. Click **Create Database**.
5. Once created, copy the **Internal Database URL** (e.g., `postgresql://journeymate_user:password@dpg-xxx:5432/journeymatedb`).

---

## 🚀 Step 2: Deploy Spring Boot Backend on Render (Native Java)

### Method A: 1-Click Blueprint (Recommended)

1. Ensure your latest changes are pushed to **GitHub**.
2. On Render Dashboard, click **New +** -> **Blueprint**.
3. Connect your **GitHub repository** (`trip-planner`).
4. Render will automatically read `render.yaml` and provision the **Native Java Web Service** and **PostgreSQL Database**.
5. Click **Apply**.

---

### Method B: Manual Web Service Creation

1. On Render Dashboard, click **New +** -> **Web Service**.
2. Connect your GitHub repository (`trip-planner`).
3. Configure the service settings:
   - **Name**: `journeymate-backend`
   - **Root Directory**: `backend`
   - **Environment / Runtime**: **`Java`** (⚠️ *Crucial: Render defaults to Node if not changed!*)
   - **Build Command**: `chmod +x mvnw && ./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/journeymate-backend-1.0.0.jar`
   - **Region**: Same region as your database.
   - **Instance Type**: **Free**.

4. Scroll down to **Environment Variables** and add:

| Key | Value / Example | Notes |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://dpg-xxx-a:5432/journeymatedb` | From Render PostgreSQL Internal Connection String (replace `postgresql://` with `jdbc:postgresql://`) |
| `SPRING_DATASOURCE_USERNAME` | `journeymate_user` | Database user |
| `SPRING_DATASOURCE_PASSWORD` | `<your-db-password>` | Database password |
| `SPRING_JPA_PLATFORM` | `org.hibernate.dialect.PostgreSQLDialect` | PostgreSQL dialect for Hibernate |
| `JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` | Secure JWT secret key |
| `OPENAI_API_KEY` | `sk-...` | Optional for live AI generation |

5. Click **Create Web Service**.
6. Render will automatically execute the Maven wrapper and start the service on `$PORT`. Once live, Render will provide your backend URL:
   `https://journeymate-backend.onrender.com`

---

## 🛠️ Troubleshooting: `mvn: command not found`

If you encounter `bash: line 1: mvn: command not found` on Render:
1. **Change Environment**: In Render Dashboard -> Web Service -> **Settings** -> **Environment**, change `Node` to **`Java`**.
2. **Use Maven Wrapper Command**: Set your Build Command to:
   ```bash
   chmod +x mvnw && ./mvnw clean package -DskipTests
   ```
3. **Redeploy**: Click **Manual Deploy** -> **Clear build cache & deploy**.

---

## ⚡ Step 3: Connect Vercel Frontend to Render Backend

You have **two options** to connect your Vercel frontend to your Render backend:

### Option 1: Vercel Environment Variable (Recommended)

1. Go to your project on [Vercel Dashboard](https://vercel.com).
2. Go to **Settings** -> **Environment Variables**.
3. Add a new variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://<your-render-backend-name>.onrender.com/api`
4. Click **Save**.
5. Go to **Deployments** -> Click **Redeploy** on your latest deployment.

---

### Option 2: Vercel Rewrites (`vercel.json`)

1. Open [frontend/vercel.json](file:///d:/trip%20planner/frontend/vercel.json).
2. Replace `YOUR-RENDER-APP-NAME` with your actual Render service name:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://journeymate-backend.onrender.com/api/:path*"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
3. Push to GitHub, and Vercel will automatically redeploy.

---

## ✅ Step 4: Verification & Testing

1. **Check Render Logs**: View the live deployment log in Render Dashboard. Look for:
   ```
   Started JourneymateBackendApplication in X.XXX seconds
   ```
2. **Open Vercel App**:
   Navigate to your Vercel URL (`https://<your-app>.vercel.app`).
   - Log in with demo credentials or register a new user:
     - Username: `demo_user` | Password: `user123`
   - Test itinerary generation, expenses, and travel tools!

---

🎉 **Congratulations! Your full-stack JourneyMate AI application is running natively on Render + Vercel!**
