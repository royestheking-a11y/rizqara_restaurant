# Rizqara Restaurant Website (Premium Full-Stack Edition)

Welcome to the official documentation for the **Rizqara Restaurant Website**. This project has been elevated from a basic template to a robust, premium full-stack application with real-time data persistence and advanced administrative controls.

---

## 🚀 Advanced Architecture

This project utilizes a modern distributed architecture, ensuring high performance and data security.

- **Frontend**: [React v18](https://reactjs.org/) (Hosted on Vercel)
- **Backend**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) (Hosted on Render)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas/database) for real-time data persistence.
- **Media Management**: [Cloudinary](https://cloudinary.com/) for optimized image and video hosting.

---

## ✨ Key Features & Specialized Systems

### 1. Real-Time "Smart Polling" Synchronization
The application implements a custom-built synchronization engine in `AppContext.tsx`. Every **10 seconds**, the client-side state is intelligently updated from the MongoDB database, ensuring that:
- **Admin Panel** sees new orders and reservations immediately.
- **Customers** receive live updates on their Order Status (Preparing, Out for Delivery, etc.).

### 2. Premium Image Upload System
The Admin Panel features a high-fidelity image upload utility with:
- **Cloudinary Integration**: Automatic optimization and CDN delivery for lightning-fast image loading.
- **10MB Upload Limit**: Supports high-resolution photography suitable for a premium dining experience.
- **Direct Stream Processing**: Files are processed in memory and streamed directly to the cloud for maximum security and speed.

### 3. Integrated Admin Dashboard
A comprehensive command center for restaurant management:
- **Orders**: Full lifecycle management with a "View Details" modal for detailed item breakdowns.
- **Reservations**: Approval/Rejection workflow for table bookings.
- **Catering Management**: Handling large-scale event inquiries.
- **Table Management**: Real-time occupation tracking and QR-code order integration.
- **Payments**: Centralized reporting and transaction analytics.
- **Internal Messaging**: Dedicated communication channel for staff and inquiries.

### 4. QR-Code Table Ordering
A specialized system for dine-in customers:
- Customers scan a table-specific QR code to access a dedicated menu.
- Orders are automatically linked to their specific table ID in the Admin Panel.
- Real-time status updates allow customers to track their meal's progress directly from their phone.

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas Account
- Cloudinary Account

### Local Development
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Configure your `.env` file with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   CLOUDINARY_URL=your_cloudinary_credentials
   VITE_API_BASE_URL=http://localhost:5001/api (for development)
   ```
3. Run the development server (Frontend + Backend):
   ```bash
   npm run dev
   ```

---

## 🔐 Administrative Access

Access the Admin Panel at `/admin` using the following credentials:
- **Username**: `admin@rizqara.com`
- **Password**: `rizqara878`

---

## 🎨 Branding & Identity
- **Established**: 2024
- **Chef**: Chef Hurika (Senior Chef — Asian Cuisine)
- **Company**: [Rizqara Tech](https://www.rizqara.tech) — Premium Dining in Barishal.

---

*This project is built for performance, scalability, and an exceptional user experience.*