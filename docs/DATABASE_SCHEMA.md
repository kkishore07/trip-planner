# 🗄️ JourneyMate AI - Database Schema & ER Diagram

The database follows clean relational modeling principles with foreign key constraints, index optimization, and audit timestamps (`created_at`, `updated_at`).

---

## 📊 Entity Relationship Diagram (Mermaid)

```mermaid
erDiagram
    USERS ||--o{ TRIPS : "plans"
    USERS ||--o{ NOTIFICATIONS : "receives"
    TRIPS ||--o{ ITINERARIES : "contains"
    TRIPS ||--o{ EXPENSES : "tracks"
    DESTINATIONS ||--o{ RECOMMENDATIONS : "features"

    USERS {
        bigint id PK
        varchar username
        varchar email
        varchar password
        varchar role
    }

    TRIPS {
        bigint id PK
        bigint user_id FK
        varchar destination
        date start_date
        date end_date
        decimal budget
        decimal total_expense
    }

    ITINERARIES {
        bigint id PK
        bigint trip_id FK
        int day_number
        varchar title
        text activities
        text restaurants
        decimal estimated_cost
    }

    EXPENSES {
        bigint id PK
        bigint trip_id FK
        varchar category
        decimal amount
        varchar currency
        date expense_date
    }
```

---

## 📋 Tables Description

1. **`users`**: User registration, hashed credentials, roles (`ROLE_USER`, `ROLE_ADMIN`).
2. **`trips`**: Travel metadata, budget allocations, total spending summaries.
3. **`itineraries`**: Day-wise activities, recommended dining spots, timing schedules.
4. **`expenses`**: Granular expense logging by categories (`HOTEL`, `FOOD`, `TRANSPORT`, `ACTIVITIES`, `MISCELLANEOUS`).
5. **`destinations`**: Pre-cached destination information.
6. **`weather_cache`**: Cached weather readings for API rate limit optimization.
7. **`recommendations`**: Rating and location metadata for local attractions.
8. **`notifications`**: System notifications for trip milestones.
