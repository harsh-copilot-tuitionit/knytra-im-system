import Link from 'next/link';

const stats = [
  { label: 'Research pending', value: '5 profiles' },
  { label: 'Onboarded', value: '10 influencers' },
  { label: 'Replies pending', value: '3 DMs' },
];

const features = [
  {
    label: 'Research',
    title: 'Centralize influencer discovery.',
    description: 'Search profiles, capture niche fit, and assign new entries to interns with a structured data flow.',
  },
  {
    label: 'Outreach',
    title: 'Track messages and replies.',
    description: 'Keep outreach history and status updates aligned to each profile in the database.',
  },
  {
    label: 'Insights',
    title: 'Manage your performance.',
    description: 'View your progress across research, negotiations, and completed influencer onboarding in one place.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 pb-20 pt-10 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-14">
        <section className="overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-950/95 p-8 shadow-glow">
          <div className="grid gap-10 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Knytra intern dashboard</p>
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                A real-time influencer operations workspace for interns and marketing teams.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300">
                Manage your roster, research new profiles, track outreach, and update the pipeline with live Firebase synchronization across every screen.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full bg-brand-500 px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-400"
                >
                  Open intern dashboard
                </Link>
                <Link
                  href="/add"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-7 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-400 hover:text-brand-300"
                >
                  Add influencer profile
                </Link>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-glow">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-brand-300">Live snapshot</p>
                  <p className="mt-2 text-2xl font-semibold text-white">Your campaign pulse</p>
                </div>
                <span className="rounded-full bg-brand-500/10 px-4 py-2 text-sm font-semibold text-brand-200">Live</span>
              </div>
              <div className="mt-8 grid gap-4">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-800 bg-slate-900/80 px-5 py-5">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.label} className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-glow">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-300">{feature.label}</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{feature.title}</h2>
              <p className="mt-4 text-slate-300">{feature.description}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-10 shadow-glow">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Get started</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Build your live influencer database today.</h2>
            <p className="mt-4 max-w-2xl text-slate-300 leading-8">
              Sign in, add your first influencer, and use the dashboard to move profiles through research, outreach, and onboarding stages with real-time Firestore syncing.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/auth"
                className="inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-400"
              >
                Sign up / log in
              </Link>
              <Link
                href="/database"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-400 hover:text-brand-300"
              >
                Explore database
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-10 shadow-glow text-slate-200">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Featured intern workflow</p>
            <ul className="mt-6 space-y-4 text-slate-300">
              <li className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">Search or add new influencer profiles.</li>
              <li className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">Capture research, contact preference and outreach notes.</li>
              <li className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">Track replies, negotiation status and onboarding progress.</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
