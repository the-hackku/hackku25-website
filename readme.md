---

# **HackKU Management System**

## Overview
The **HackKU Management System** helps manage hackathon logistics, from participant registration to event check-ins. It provides organizers and admins with tools to easily manage users, events, and real-time attendance through a simple web interface.

## Features

- **User Registration & Login**: Sign in using email and passwordless authentication.
- **QR Code Check-Ins**: Participants receive QR codes to check into events.
- **Admin Dashboard**: Full control over users, events, and check-in stats.
- **Real-time Tracking**: Track attendance and check-ins in real time.
- **Google Sheets Backup**: Export data to Google Sheets for safe storage.
- **Payment Integration**: Stripe support for payments and payouts.
- **Notifications**: Email notifications for sign-in and event details.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma, PostgreSQL
- **Email & Payments**: Nodemailer, Stripe
- **Deployment**: Vercel (Frontend), Render (Backend)

## Setup & Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/hackku-management.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables by copying `.env.example` to `.env` and filling in your values:
   ```bash
   cp .env.example .env
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Visit `http://localhost:3000` in your browser.

## Usage

- **Register**: Participants sign up, providing their details.
- **Check-In**: Use QR codes to check into events.
- **Admin Panel**: Manage users, events, and monitor live attendance.
- **Export Data**: Export event and user data to Google Sheets for backup.

---
