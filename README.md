# Knytra Influence Hub

A modern influencer management website built with Next.js, TypeScript, Tailwind CSS, Firebase Auth, Firestore, and optional Firebase Hosting.

## What is included

- Next.js app router with TypeScript
- Tailwind CSS styling
- Firebase Auth for email/password + Google login
- Firestore real-time listeners for campaigns and influencers
- Admin settings page that writes directly to Firestore
- Firebase Hosting / Vercel ready deployment configuration

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment values:

```bash
copy .env.local.example .env.local
```

3. Add your Firebase project values to `.env.local`.

4. Run locally:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Firebase setup

1. Create a Firebase project at https://console.firebase.google.com.
2. Enable Authentication (Email/Password and Google).
3. Create a Firestore database in production or test mode.
4. Add a Web app and copy the config values to `.env.local`.

## Deploying

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Vercel

Connect the repository to Vercel and add all `NEXT_PUBLIC_FIREBASE_*` env variables.

## Notes

- The dashboard and settings use Firestore `onSnapshot` for real-time updates.
- The admin settings page writes brand profile data to `settings/brand`.
- Use `/auth` to sign in and `/dashboard` to view live data.
