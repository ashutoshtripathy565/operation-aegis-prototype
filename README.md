# 🛡️ OPERATION AEGIS — Decision Support System

An advanced tactical military readiness and decision support platform built with **React 18** and **Vite**.

---

## 🚀 Quick Start (Running on Any Windows PC)

### 1. First-Time Setup
Double-click **`SETUP.bat`**.
The installer will automatically:
- Check for Node.js (and install it if missing)
- Configure execution permissions
- Install project packages (`npm install`)
- Place **Start** and **Stop** shortcuts directly onto your Desktop

### 2. Launching the Application
- Double-click the **`Start OPERATION AEGIS`** icon on your Desktop (or run `start-server.bat`).
- The website will start and open automatically in your web browser at:
  **`http://localhost:5173`**

### 3. Stopping the Application
- Double-click the **`Stop OPERATION AEGIS`** icon on your Desktop (or run `stop-server.bat`), or close the server command window.

---

## 🎨 Redesigning and Customizing
The source code is completely open, modular, and editable:
- To customize themes, colors, and fonts, see **[`REDESIGN_GUIDE.md`](./REDESIGN_GUIDE.md)**.
- Main stylesheet: [`src/index.css`](./src/index.css)
- Pages and screens: [`src/pages/`](./src/pages/)
- Military personnel data: [`src/context/AegisContext.jsx`](./src/context/AegisContext.jsx)

---

## 📦 Sharing with Others
To share this project with teammates or install it on another computer:
1. Double-click **`PACKAGE_FOR_SHARING.bat`**.
2. A clean zip file (`OPERATION_AEGIS_Setup_Package.zip`) will be created on your Desktop.
3. Send this zip to anyone. On their computer, they just extract the zip and double-click **`SETUP.bat`**!

---

## 🔐 Built-in Sandbox Demo Credentials

When running in local development mode, you can log in instantly using the bypass buttons on the login page or using these credentials:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Commander** (Capt. Vikram Batra) | `IC-57556H` | `070799` |
| **Soldier** (Hav. Rajesh Kumar) | `JC-472118K` | `demo123` |
| **Medical Officer** | `medical.officer` | `aegis123` |
| **System Admin** | `admin.system` | `aegis123` |
