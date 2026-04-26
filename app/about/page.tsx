import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-10 shadow-glow">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-300">About Us</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Built to help interns manage creators confidently</h1>
          <p className="mt-4 text-slate-300 leading-8">
            Knytra blends research, outreach tracking, and database workflow into a single, live interface. We help marketing interns and operations teams move influencers through sourcing, negotiation, and onboarding with confidence.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-950/70 p-6">
              <h2 className="text-lg font-semibold text-white">Why Knytra</h2>
              <p className="mt-3 text-slate-300">A fresh take on the influencer funnel, built for real-time team collaboration and streamlined database workflows.</p>
            </div>
            <div className="rounded-3xl bg-slate-950/70 p-6">
              <h2 className="text-lg font-semibold text-white">Our approach</h2>
              <p className="mt-3 text-slate-300">Research, outreach, onboarding, and measurement—connected in one secure portal with Firebase powering updates live.</p>
            </div>
          </div>
          <Link href="/" className="mt-8 inline-flex rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-400">
            Back to home
          </Link>
        </section>
      </div>
    </main>
  );
}
