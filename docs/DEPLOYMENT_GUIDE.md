# 🚀 JourneyMate AI - Production Deployment Guide

This guide details deploying JourneyMate AI to production using Docker Compose, Nginx, PostgreSQL, and CI/CD pipelines.

---

## 📦 Prerequisites

- Docker 24+ & Docker Compose v2+
- Domain Name with SSL Certificate (Let's Encrypt / Certbot)
- Server Instance (2 CPU, 4GB RAM minimum recommended)

---

## 🐳 Deployment via Docker Compose

1. Clone repository to your production server:
   ```bash
   git clone https://github.com/your-org/journeymate-ai.git
   cd journeymate-ai
   ```

2. Set Environment Variables (`.env`):
   ```env
   SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/journeymatedb
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=your_secure_password
   OPENAI_API_KEY=your_openai_api_key
   OPENWEATHER_API_KEY=your_openweather_api_key
   ```

3. Launch Stack:
   ```bash
   docker compose -f devops/docker-compose.yml up -d --build
   ```

---

## 🔒 Nginx Reverse Proxy & SSL Setup

Sample `/etc/nginx/sites-available/journeymate.conf`:

```nginx
server {
    listen 80;
    server_name journeymate.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name journeymate.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/journeymate.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/journeymate.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8080/api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
