import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 pb-20 pt-10 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-14">
        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-10 shadow-glow">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Knytra intern dashboard</p>
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white">A real-time influencer operations workspace for interns and marketing teams.</h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300">
                Manage your roster, research new profiles, track outreach, and update the pipeline with live Firebase synchronization across every screen.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/dashboard" className="rounded-full bg-brand-500 px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-400">
                  Open intern dashboard
                </Link>
                <Link href="/add" className="rounded-full border border-slate-700 bg-slate-950 px-7 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-400 hover:text-brand-300">
                  Add influencer profile
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 text-slate-200 shadow-glow">
              <p className="uppercase tracking-[0.2em] text-brand-300">Live snapshot</p>
              <div className="mt-8 grid gap-4">
                <div className="rounded-3xl bg-slate-900/80 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Research pending</p>
                  <p className="mt-3 text-3xl font-semibold text-white">5 profiles</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Onboarded</p>
                  <p className="mt-3 text-3xl font-semibold text-white">10 influencers</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Replies pending</p>
                  <p className="mt-3 text-3xl font-semibold text-white">3 DMs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 shadow-glow">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Research</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Centralize influencer discovery.</h2>
            <p className="mt-4 text-slate-300">Search profiles, capture niche fit, and assign new entries to interns with a structured data flow.</p>
          </article>
          <article className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 shadow-glow">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Outreach</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Track messages and replies.</h2>
            <p className="mt-4 text-slate-300">Keep outreach history and status updates aligned to each profile in the database.</p>
          </article>
          <article className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 shadow-glow">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Insights</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Manage your performance.</h2>
            <p className="mt-4 text-slate-300">View your progress across research, negotiations, and completed influencer onboarding in one place.</p>
          </article>
        </section>

        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-10 shadow-glow">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Get started</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Build your live influencer database today.</h2>
              <p className="mt-4 text-slate-300 leading-8">Sign in, add your first influencer, and use the dashboard to move profiles through research, outreach, and onboarding stages with real-time Firestore syncing.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/auth" className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-400">
                  Sign up / log in
                </Link>
                <Link href="/database" className="rounded-full border border-slate-700 bg-slate-950 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-400 hover:text-brand-300">
                  Explore database
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 text-slate-200">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Featured intern workflow</p>
              <ul className="mt-6 space-y-4 text-slate-300">
                <li className="rounded-3xl bg-slate-900/80 p-4">Search or add new influencer profiles.</li>
                <li className="rounded-3xl bg-slate-900/80 p-4">Capture research, contact preference and outreach notes.</li>
                <li className="rounded-3xl bg-slate-900/80 p-4">Track replies, negotiation status and onboarding progress.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
