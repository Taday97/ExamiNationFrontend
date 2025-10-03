# 🧠 IQ Test Platform

![Angular](https://img.shields.io/badge/Angular-19-dd0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

An interactive IQ test platform built with **Angular 19**.  
Users can take categorized IQ tests, get detailed performance insights, and admins can manage content, users, and analytics through a secure dashboard.

👉 Backend Repository: [link here](https://github.com/yourusername/backend-repo)

---

## 📑 Table of Contents
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚡ Getting Started](#-getting-started)
- [🚀 Usage](#-usage)
- [📸 Screenshots](#-screenshots)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 👤 User
- Browse available tests and take them question by question.
- Detailed results:
  - Total score (e.g., `35/50`)
  - Overall performance level (e.g., *Above Average*)
  - Test duration & completion stats
  - Category breakdown (Logic, Verbal, Memory, Math)
  - Insights + personalized recommendations
- View personal test history and progress.

### 🛡️ Admin
- **Role-based dashboard** with protected routes.
- CRUD for tests, questions & categories.
- Define valid score ranges & result interpretations.
- Manage users and assign roles.
- View aggregated user results with filters & export options.

### 🔒 Security
- Google OAuth & email/password login.
- Role-based access control (RBAC).
- Global error handling & interceptors.

### ⚡ Technical Highlights
- Responsive & mobile-first design.
- Lazy-loaded modules for performance.
- State management with services/NgRx.
- Integration with backend REST APIs.

---

## 🛠️ Tech Stack

- **Frontend**: Angular 19, TypeScript, RxJS, Angular Router, Angular HttpClient  
- **UI**: Angular Material / Bootstrap (customizable)  
- **Auth**: Google OAuth / JWT-based  
- **Other**: HTTP interceptors, Reactive forms  

---

## ⚡ Getting Started

### Prerequisites
- Node.js >= 18  
- Angular CLI >= 19  
- Backend API (running locally or deployed)

### Installation
```bash
# Clone the repo
git clone https://github.com/Taday97/ExamiNation.git
cd ExamiNation

# Install dependencies
npm install

# Run the app
ng serve

```
## 📸 Screenshots
### 🔑 Login Page

![Login with Google](https://github.com/user-attachments/assets/2961feb6-bb6c-441d-8da8-6851f73df1df)

### 🏠 Homepage
![Homepage](https://github.com/user-attachments/assets/fb56ce95-6811-44cc-b1cb-a72699f40bbe
)

### 📝 Taking a Test
![Test View](https://github.com/user-attachments/assets/84b8f840-1eb2-4d1b-8733-46c8e96bab3f)

### 📝 My Tests
![Test View](https://github.com/user-attachments/assets/d9ec9bd6-16da-48d7-8651-88b04fc0ad67)


### 📊 Results Page
![Results](https://github.com/user-attachments/assets/a3e18c6e-97a8-49ca-ab3b-23ff0ebd5e5e)

### ⚙️ Admin Dashboard
![Admin Dashboard](https://github.com/user-attachments/assets/ea257091-b122-46d2-bb7c-769f4077277a
)

### 📈 Admin Results with Filters
![Admin Results](https://github.com/user-attachments/assets/7a28c9e0-e040-487c-9591-257739ce2345)
