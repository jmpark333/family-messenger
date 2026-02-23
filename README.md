# Family Messenger

> A modern family messaging application built with React, TypeScript, and Firebase.

A real-time messaging platform designed for families to stay connected, featuring secure authentication, instant messaging, and a beautiful responsive UI.

## 🚀 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 19, TypeScript 5 |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 4 |
| **State Management** | Zustand |
| **Database** | Dexie (IndexedDB), Upstash Redis |
| **Backend** | Firebase (Auth, Database, Storage) |
| **Routing** | React Router DOM 7 |
| **Icons** | Lucide React |
| **Testing** | Vitest, Testing Library |
| **Deployment** | Netlify, Vercel |

## 📋 Prerequisites

- Node.js 18+
- npm or bun
- Firebase project with Authentication and Realtime Database enabled
- (Optional) Upstash Redis account

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jmpark333/family-messenger.git
   cd family-messenger
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Fill in your Firebase configuration values from the [Firebase Console](https://console.firebase.google.com/):
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   FIREBASE_CONFIG=your_secret_key
   ```

4. **Configure Firebase Security Rules**

   Ensure your `firebase.rules` is properly configured in your Firebase Console.

## 🎯 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run
```

## 📁 Project Structure

```
family-messenger/
├── api/              # API routes and serverless functions
├── app/              # Next.js/React app pages
├── public/           # Static assets
├── src/              # Source code
├── types/            # TypeScript type definitions
├── docs/             # Documentation
├── .github/          # GitHub workflows
├── firebase.rules    # Firebase security rules
├── netlify.toml      # Netlify deployment config
├── vercel.json       # Vercel deployment config
└── vite.config.ts    # Vite configuration
```

## 🚢 Deployment

### Netlify
1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Vercel
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🔐 Security

- Firebase Authentication for user management
- Firebase Security Rules for data protection
- Environment variables for sensitive data
- CORS configuration for API routes

## 📝 License

This project is private.

## 👥 Author

**JAMESPARK** - [GitHub](https://github.com/jmpark333)

---

Made with ❤️ for family communication
