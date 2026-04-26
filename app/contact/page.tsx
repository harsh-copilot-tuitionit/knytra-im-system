import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-10 shadow-glow">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Contact Us</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Let's build your influencer roadmap</h1>
          <p className="mt-4 text-slate-300 leading-8">
            Reach out to the Knytra team for onboarding, campaign strategy, or product partnership support. We help interns, brand teams, and creator ops move profiles through the pipeline effectively.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-950/70 p-6">
              <h2 className="text-lg font-semibold text-white">Email</h2>
              <p className="mt-3 text-slate-300">support@knytra.io</p>
            </div>
            <div className="rounded-3xl bg-slate-950/70 p-6">
              <h2 className="text-lg font-semibold text-white">Office</h2>
              <p className="mt-3 text-slate-300">Remote-first · Available Monday–Friday</p>
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
