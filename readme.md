# **HackKU Management System**

## Overview

The **HackKU Management System** helps manage hackathon logistics, from participant registration to event check-ins. It provides organizers and admins with tools to easily manage users, events, and real-time attendance through a simple web interface.

## Features

- **User Registration & Login**: Sign in using email and passwordless authentication.
- **QR Code Check-Ins**: Participants receive QR codes to check into events.
- **Admin Dashboard**: Full control over users, events, and check-in stats.
- **Real-time Tracking**: Track attendance and check-ins in real time.
- **Google Sheets Backup**: Export data to Google Sheets for safe storage.
- **Notifications**: Email notifications for sign-in and event details.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, ShadcnUI
- **Backend**: Next.js API Routes, Prisma, PostgreSQL
- **Email**: Nodemailer
- **Deployment**: Vercel

## Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/the-hackku/hackku25-website/tree/nextjs
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up environment variables**:

   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in your database URL and other environment variables in the `.env` file:
     ```
     DATABASE_URL="your-database-url"
     EMAIL_SERVER="smtp://username:password@mailserver.com:587"
     ```

4. **Initialize the database with Prisma**:

   ```bash
   npx prisma migrate dev --name init
   ```

   This command will create the necessary tables in your database.

5. **Generate the Prisma client**:

   ```bash
   npx prisma generate
   ```

6. **Run the development server**:

   ```bash
   npm run dev
   ```

7. Visit `http://localhost:3000` in your browser to access the application.

## Usage

- **Register**: Participants sign up, providing their details.
- **Check-In**: Use QR codes to check into events.
- **Admin Panel**: Manage users, events, and monitor live attendance.
- **Export Data**: Export event and user data to Google Sheets for backup.

## Contributing

We welcome contributions to improve this system! If you'd like to contribute, please:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request for review.

## License

This project is licensed under the MIT License.

## Contact

For any questions or support, please reach out at [help@hackku.org](mailto:help@hackku.org).
