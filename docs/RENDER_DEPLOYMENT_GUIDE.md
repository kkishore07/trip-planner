# 🌐 Deploying JourneyMate AI Backend on Render + Frontend on Vercel

This guide provides step-by-step instructions to deploy your **Spring Boot 3 (Java 21) Backend** and **PostgreSQL Database** on [Render](https://render.com), and connect them to your **Vercel** frontend.

---

## 🏗️ Architecture Overview

- **Frontend**: Hosted on **Vercel** (`https://<your-app>.vercel.app`)
- **Backend API**: Cloud-built Spring Boot Web Service on **Render** (`https://<your-backend>.onrender.com`)
- **Database**: Managed **PostgreSQL** on **Render**.

> 💡 **Note**: Render builds your Java backend automatically in the cloud. You **do not** need Docker installed or running on your local computer!

---

## 📑 Quick Table of Contents

1. [Option A: 1-Click Render Blueprint Deployment (Recommended)](#option-a-1-click-render-blueprint-deployment-recommended)
2. [Option B: Manual Render Web Service Creation](#option-b-manual-render-web-service-creation)
3. [Connecting Vercel Frontend to Render Backend](#connecting-vercel-frontend-to-render-backend)

---

## 🚀 Option A: 1-Click Render Blueprint Deployment (Recommended)

1. Push all latest changes to **GitHub**:
   ```bash
   git add .
   git commit -m "fix: update render.yaml blueprint"
   git push origin main
   ```
2. Open [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> **Blueprint**.
4. Select your **GitHub repository** (`trip-planner`).
5. Render will automatically read `render.yaml` and provision both:
   - **PostgreSQL Database** (`journeymate-postgres`)
   - **Spring Boot Web Service** (`journeymate-backend`)
6. Click **Apply**. Render will handle building and launching your backend automatically!

---

## 🛠️ Option B: Manual Render Web Service Creation

If you prefer deploying services manually without Blueprint:

### Step 1: Create Database
1. On Render Dashboard, click **New +** -> **PostgreSQL**.
2. **Name**: `journeymate-db` | **Database**: `journeymatedb` | **User**: `journeymate_user`
3. Click **Create Database** and copy the **Internal Database URL**.

### Step 2: Create Web Service
1. Click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Name**: `journeymate-backend`
   - **Root Directory**: `backend`
   - **Environment / Runtime**: `Docker`
   - **Dockerfile Path**: `backend/Dockerfile`
4. Add Environment Variables:
   - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<internal-db-host>:5432/journeymatedb`
   - `SPRING_DATASOURCE_USERNAME`: `journeymate_user`
   - `SPRING_DATASOURCE_PASSWORD`: `<your-db-password>`
   - `SPRING_JPA_PLATFORM`: `org.hibernate.dialect.PostgreSQLDialect`
   - `JWT_SECRET`: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
5. Click **Create Web Service**.

---

## ⚡ Connecting Vercel Frontend to Render Backend

1. In your **Vercel Dashboard** -> **Settings** -> **Environment Variables**.
2. Add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://<your-render-backend-name>.onrender.com/api`
3. Go to **Deployments** -> Click **Redeploy**.

---

🎉 **Congratulations! Your full-stack JourneyMate AI application is running on Render + Vercel!**
