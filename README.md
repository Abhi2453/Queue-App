# QueueApp – Smart Token & Queue Management System

Queue App is a modern web application that streamlines queue and appointment management for service providers, government offices, and customers. It replaces traditional manual token systems with a digital, real-time tracking solution, enhancing operational efficiency and customer experience.

---

## Features

### 👤 User Features

- 🔍 Search services by location (State > District > Mandal > Village)
- 📅 Book tokens online with automatic assignment
- ⏱️ Track real-time token progress
- ❌ Cancel bookings with one click

### 🧑‍💼 Provider Features

- 📍 Add and manage services by location
- ⏲️ Set token interval time (`tokenTime`)
- ▶️ Start / ⏸️ Pause / 🔁 Resume / ⏹️ Stop token flow
- 🔄 Auto-increment current token every few minutes
- 🔄 Reset tokens automatically when finished

### 🔐 Authentication

- Role-based login (User and Provider)
- Firebase Authentication
- Firestore role validation on login

---

## 🛠 Tech Stack

| Layer              | Tools Used                |
| ------------------ | ------------------------- |
| Frontend           | React, Vite, Tailwind CSS |
| Backend/DB         | Firebase Firestore        |
| Auth               | Firebase Authentication   |
| Hosting (optional) | Firebase Hosting          |

---
