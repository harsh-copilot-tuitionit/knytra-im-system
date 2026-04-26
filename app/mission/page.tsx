import Link from 'next/link';

export default function MissionPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-10 shadow-glow">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Our Mission</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Empower every intern to own the pipeline</h1>
          <p className="mt-4 text-slate-300 leading-8">
            We believe talent sourcing should feel simple, smart, and secure. Knytra brings workflow clarity to every stage, from research to outreach to onboarding. Our mission is to make creator operations faster and more transparent for every team member.
          </p>
          <Link href="/" className="mt-8 inline-flex rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-400">
            Back to home
          </Link>
        </section>
      </div>
    </main>
  );
}
