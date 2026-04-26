'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';

export default function AuthPage() {
  const router = useRouter();
  const { user, signIn, signUp, signInWithGoogle, signOut, authError } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const statusMessage = useMemo(() => {
    if (authError) return authError;
    if (user) return `Signed in as ${user.email}`;
    return 'Secure Knytra login powered by Firebase Auth';
  }, [authError, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      if (isRegister) {
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
      router.push('/dashboard');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-800 bg-slate-950/95 p-10 shadow-glow">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Knytra login</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Enter your KNYTRA ID</h1>
          <p className="mt-4 text-slate-400">Use your email or assigned username to access the intern dashboard and database tools.</p>
          <p className="mt-2 text-sm text-slate-500">{statusMessage}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <label className="block text-sm font-medium text-slate-200">
              Full name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Intern Name"
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
              />
            </label>
          )}
          <label className="block text-sm font-medium text-slate-200">
            Username or email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="enter your KNYTRA ID"
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
            />
          </label>
          <label className="block text-sm font-medium text-slate-200">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
            />
          </label>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRegister ? 'Request access' : 'Log in'}
          </button>

          <button
            type="button"
            onClick={async () => {
              setBusy(true);
              try {
                await signInWithGoogle();
                router.push('/dashboard');
              } finally {
                setBusy(false);
              }
            }}
            className="w-full rounded-full border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-brand-400 hover:text-brand-300"
          >
            Continue with Google
          </button>

          <div className="flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:justify-between">
            <button type="button" onClick={() => setIsRegister(!isRegister)} className="font-semibold text-slate-100 transition hover:text-brand-300">
              {isRegister ? 'Already have an account?' : 'New intern? Sign up to request access'}
            </button>
            <button type="button" className="text-brand-300 hover:text-brand-400">
              Forgot password?
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
