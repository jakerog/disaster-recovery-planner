# Sentinel - Disaster Recovery Orchestrator

Sentinel is a professional, clean, and modern Disaster Resilience & Recovery Orchestration platform. Built as a Progressive Web App (PWA) with a mobile-native feel, it enables organizations to execute complex DR exercises with precision.

## Key Features

- **Mission Control**: Tactical monitor for real-time recovery execution across multiple phases (Mock 1, 2, 3 & Production).
- **5-Tier Recovery Hierarchy**: Exercise > Phase > Event (Failover/Failback) > Stage > Task.
- **Role-Based Access Control (RBAC)**: Secure access for Admins, Moderators, Reporters, and recovery agents.
- **Resource Readiness**: A dedicated portal for resources to check in and validate their availability ahead of recovery windows.
- **Advanced Analytics**: Detailed reporting on SLA targets, actual durations, and efficiency variance using interactive charts.
- **Communication Center**: Management of standardized email templates and strategic resource pools with broadcast scheduling.
- **Evidence Integrity**: Functional Base64-based visual proof/photo logging for mission-critical task verification.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js v5 (Auth.js)
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **PWA**: @ducanh2912/next-pwa

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. Seed the database with sample DR data:
   ```bash
   node prisma/seed.js
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Default Credentials (for testing)

- **Admin**: admin@sentinel.com / password123
- **User**: agent@sentinel.com / password123
- **Reporter**: report@sentinel.com / password123

## Deployment

The application is configured for deployment on Vercel with a secure pipeline that preserves production data during schema synchronization.

---
*Global Operations Matrix v2.0*
