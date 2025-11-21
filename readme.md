# 🚀 Fullstack Auth

![React](https://img.shields.io/badge/-React-blue?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/-Node.js-green?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express-black?logo=express&logoColor=white)
![Sequelize](https://img.shields.io/badge/-Sequelize-blue?logo=sequelize&logoColor=white)

## 📝 Overview

Fullstack Auth adalah project **React + Node.js (Express)** dengan fitur autentikasi lengkap seperti register, login, protected route, dan JWT authentication. Cocok untuk dijadikan pondasi project fullstack biar gak bikin auth dari nol lagi.

## ✨ Features

- 🔐 Register & Login
- 🔑 JWT Authentication
- 🚫 Protected Routes
- 📦 CRUD Items
- ⚛️ Full Web Client (React)
- 🌐 REST API (Express + Sequelize)

## 🛠 Tech Stack

### Frontend
- React
- React Bootstrap
- React Router DOM
- Axios

### Backend
- Node.js + Express
- Sequelize ORM
- MySQL Database

## 📦 Key Dependencies

```
axios: ^1.13.2
bootstrap: ^5.3.8
react: ^19.2.0
react-bootstrap: ^2.10.10
react-dom: ^19.2.0
react-router-dom: ^7.9.6
```

## 🚀 Run Commands

### Frontend
- Start dev → `npm run dev`
- Build → `npm run build`
- Lint → `npm run lint`
- Preview → `npm run preview`

### Backend
- Install dependencies → `npm install`
- Start server → `node server.js`
- Run migrations → `npx sequelize-cli db:migrate`

## 📁 Project Structure

```
.
├── client
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── public
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets
│   │   ├── components
│   │   │   ├── Navbar.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── context
│   │   │   └── AuthContext.jsx
│   │   ├── pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Items.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   └── services
│   │       ├── api.js
│   │       ├── authServices.js
│   │       └── itemService.js
│   └── vite.config.js
└── server
    ├── config
    ├── controllers
    │   ├── auth.controller.js
    │   └── itemController.js
    ├── middleware
    │   └── auth.js
    ├── migrations
    ├── models
    ├── routes
    │   ├── authRoute.js
    │   └── itemRoute.js
    └── server.js
```

## 🛠 Development Setup

### Requirements
- Node.js v18+
- MySQL running
- (Optional) Install Sequelize CLI  
  `npm install -g sequelize-cli`

### Backend Setup
1. Edit `config/config.json` sesuai database.
2. Jalankan migrasi:
   ```
   npx sequelize-cli db:migrate
   ```
3. Start server:
   ```
   node server.js
   ```

### Frontend Setup
1. Pindah ke folder `client`
2. Install dependencies:
   ```
   npm install
   ```
3. Jalankan dev server:
   ```
   npm run dev
   ```

## 👥 Contributing

1. Fork repository  
2. Clone fork kamu:
   ```
   git clone https://github.com/Tulus04/fullstack-auth.git
   ```
3. Buat branch baru:
   ```
   git checkout -b feature/your-feature
   ```
4. Commit perubahan:
   ```
   git commit -am "Add new feature"
   ```
5. Push ke branch:
   ```
   git push origin feature/your-feature
   ```
6. Buka Pull Request

---

✨ *Happy coding* 🔥
