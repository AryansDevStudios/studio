# 🎮 Tic-Tac-Toe Arena (`studio`)

> Real-time multiplayer Tic-Tac-Toe arena with 4-digit match rooms, live board synchronization, and persistent player stats tracking.

![Next.js](https://img.shields.io/badge/Next.js-v15.3-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-v18.3-61DAFB?logo=react&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-v11%20Firestore-FFCA28?logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3.4-38B2AC?logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-v5-3178C6?logo=typescript&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 📖 Overview

**Tic-Tac-Toe Arena** is a real-time multiplayer web game crafted with Next.js 15, React 18, and Firebase Firestore. It transforms the classic paper-and-pencil game of X's and O's into a competitive online arena where players create custom 4-digit match rooms, share room codes with opponents anywhere in the world, and battle with synchronized live state.

The platform provides a responsive, accessible interface with real-time turn detection, animated game pieces, comprehensive win/loss/draw stat tracking, and one-click rematch triggers.

---

## ✨ Features

- **4-Digit Matchmaking Rooms**: Quick-create or join matches using memorable 4-digit numeric room codes (`^\d{4}$`) with automatic room collision handling.
- **Real-Time Board Sync**: Sub-second synchronization of game moves and player turns across remote clients powered by Firebase Firestore document subscriptions.
- **Custom Player Identity**: Personalized player names with unique guest player ID generation persisted across sessions.
- **Automated Win & Draw Detection**: Instant algorithmic checking across 3x3 rows, columns, and diagonals with animated highlights for winning combinations.
- **Interactive Game Result Dialog**: Real-time modal upon match conclusion displaying the victor or draw notification with instant rematch and return-to-lobby options.
- **One-Click Rematches**: Reset the board state immediately for another round without requiring players to enter new room codes.
- **Comprehensive Player Stats**: Local tracking of total matches played, victories, defeats, and ties, featuring a confirmation dialog to reset historical records.
- **Fluid & Accessible Interface**: Polished UI built with Radix UI primitives, Lucide icons, glassmorphism cards, and Tailwind CSS animations.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.3](https://nextjs.org/) (App Router)
- **Frontend Library**: [React 18.3](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Database & State Sync**: [Firebase v11](https://firebase.google.com/) (Cloud Firestore)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), Radix UI Primitives, Lucide Icons, `tailwind-merge`
- **Validation & Forms**: React Hook Form, Zod

---

## 📁 Project Structure

```
studio/
├── apphosting.yaml           # Firebase App Hosting configuration
├── next.config.ts            # Next.js configuration
├── package.json              # Project dependencies & scripts
├── tailwind.config.ts        # Tailwind design tokens & themes
├── tsconfig.json             # TypeScript compiler configuration
└── src/
    ├── app/
    │   ├── layout.tsx        # Root application layout
    │   ├── page.tsx          # Main lobby, matchmaking & stats dashboard
    │   └── [roomId]/
    │       └── page.tsx      # Dynamic match room route and game container
    ├── components/
    │   ├── create-or-join-room.tsx # 4-digit room code input and creator dialog
    │   ├── game-result-dialog.tsx  # Victory/draw modal with rematch actions
    │   ├── game-room.tsx     # Active game orchestrator & player status cards
    │   ├── player-name-dialog.tsx  # Name prompt dialog before match entry
    │   ├── tic-tac-toe-board.tsx   # 3x3 interactive board with turn sync
    │   └── ui/               # Radix UI primitives (alert-dialog, card, tabs, etc.)
    ├── hooks/
    │   ├── use-game-stats.ts # Win/loss/draw persistent analytics hook
    │   ├── use-player-id.ts  # Unique client player ID generator
    │   └── use-toast.ts      # UI notification dispatch hook
    └── lib/
        ├── firebase.ts       # Firebase app initialization & Firestore client
        └── utils.ts          # Styling helper utilities
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `18.x` or later
- npm or pnpm
- A Firebase project with **Cloud Firestore** enabled

### 1. Clone Repository

```bash
git clone https://github.com/AryansDevStudios/studio.git
cd studio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build

```bash
npm run build
npm start
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
