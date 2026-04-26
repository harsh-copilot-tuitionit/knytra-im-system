import { initializeApp, getApps } from 'firebase/app';
import { getAuth as firebaseGetAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore as firebaseGetFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
};

let firebaseApp: ReturnType<typeof initializeApp> | null = null;
let firebaseAuth: ReturnType<typeof firebaseGetAuth> | null = null;
let firestoreInstance: ReturnType<typeof firebaseGetFirestore> | null = null;
let googleProvider: GoogleAuthProvider | null = null;

function validateFirebaseConfig() {
  const missingFields = Object.entries(firebaseConfig)
    .filter(([, value]) => !value || (typeof value === 'string' && value.trim() === ''))
    .map(([key]) => key);

  if (missingFields.length > 0) {
    throw new Error(
      `Missing Firebase configuration values: ${missingFields.join(', ')}. ` +
        'Create a .env.local file from .env.local.example and add your Firebase web app config values.'
    );
  }
}

function initFirebase() {
  if (typeof window === 'undefined') {
    return;
  }

  if (!firebaseApp) {
    validateFirebaseConfig();
    firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    firebaseAuth = firebaseGetAuth(firebaseApp);
    firestoreInstance = firebaseGetFirestore(firebaseApp);
    googleProvider = new GoogleAuthProvider();
  }
}

export function getFirebaseAuth() {
  initFirebase();
  if (!firebaseAuth) {
    throw new Error('Firebase Auth is only available in the browser after environment variables are configured.');
  }
  return firebaseAuth;
}

export function getFirestore() {
  initFirebase();
  if (!firestoreInstance) {
    throw new Error('Firestore is only available in the browser after environment variables are configured.');
  }
  return firestoreInstance;
}

export function getGoogleProvider() {
  initFirebase();
  if (!googleProvider) {
    throw new Error('GoogleAuthProvider is only available in the browser after Firebase is initialized.');
  }
  return googleProvider;
}
