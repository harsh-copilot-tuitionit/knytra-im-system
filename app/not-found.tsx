import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-10">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-800 bg-slate-900/80 p-10 text-center shadow-glow">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Page unavailable</p>
        <h1 className="mt-6 text-4xl font-semibold text-white">Where did that go?</h1>
        <p className="mt-4 text-slate-300">The page you requested cannot be found. Return to the main portal or login page.</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/" className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-400">
            Home
          </Link>
          <Link href="/auth" className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 hover:border-brand-400 hover:text-brand-300">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
