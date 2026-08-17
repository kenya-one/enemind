# Enemind — Kenyan Multi-Sided Marketplace & Discovery Platform

Enemind is a high-performance Progressive Web Application (PWA) and multi-sided ecosystem tailored for the Kenyan market. It connects students, schools, campus landlords, certified solar dealers, construction suppliers, and local merchants across Nairobi, Kiambu, Ruiru, Juja, and countrywide economic corridors.

---

## 🚀 Key Modules & Capabilities

- **Findlocal Radar & Best of Findlocals Tour**: Real-time GPS-assisted dealer radar locating cement, hardware, organic produce, solar kits, and services with delivery dispatch.
- **Marketplace & Direct Checkout**: M-Pesa STK Push / Pesapal payment simulation, bulk pricing tiers, and direct WhatsApp contact.
- **Video Shorts & Live Walkthroughs**: YouTube Live integration for real-time solar tech demonstrations and student hostel tours.
- **Campus Student Living**: Verified bedsitters and 1-bedroom apartments near JKUAT, KU, UoN, and Strathmore with zero broker fees.
- **CBC & KCSE Hub**: Competency tracking, syllabus notes, and past examination papers for schools and students.
- **Stakeholder Workspaces**: Dedicated channels for Schools, Companies/Dealers, Landlords, and Students.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Lucide React Icons
- **Animation & FX**: Motion + Canvas Confetti
- **Editor & Tooling**: VS Code settings & recommended extensions

---

## 💻 Local Development Setup (VS Code)

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) and **npm** installed on your system.

### 2. Clone the Repository
```bash
git clone https://github.com/enemindcompany/enemind.git
cd enemind
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to create your `.env` file:
```bash
cp .env.example .env
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Connecting VS Code to your GitHub Repository

Configure Git with your email (`enemindcompany@gmail.com`) and link to `https://github.com/enemindcompany/enemind.git`:

```bash
# 1. Configure your Git credentials
git config --global user.name "enemindcompany"
git config --global user.email "enemindcompany@gmail.com"

# 2. Initialize and stage all files
git init
git add .

# 3. Create initial commit
git commit -m "feat: setup Enemind marketplace platform"

# 4. Link your remote GitHub repository
git remote add origin https://github.com/enemindcompany/enemind.git

# 5. Push to GitHub main branch
git branch -M main
git push -u origin main
```

> **Tip for Google AI Studio users**: You can also use the **Export to GitHub** or **Export to ZIP** option in the top right menu of AI Studio to sync directly with your GitHub account.

---

## 📋 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server on port 3000 |
| `npm run build` | Compiles and optimizes assets into the `dist/` directory |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs TypeScript type checking |
| `npm run clean` | Cleans up build artifacts |

---

## 📄 License
MIT
