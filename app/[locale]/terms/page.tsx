export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24 text-zinc-900 dark:text-zinc-100">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-zinc-500 mb-8">Last updated: October 2026</p>

      <section className="space-y-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using ViCareerAI, you agree to these Terms of Service. If you disagree, do not use the service.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">2. Service Usage & Quotas</h2>
          <p>
            Free tier users are granted 2 saved resumes, 3 cover letters, and 5 AI suggestions. Pro users receive unlimited resumes and cover letters as specified in their plan. Abusive behavior, automated scraping, or reverse engineering of APIs is prohibited.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">3. Subscriptions & Billing</h2>
          <p>
            Pro subscriptions are processed via LemonSqueezy. You may cancel your subscription at any time via your account settings; cancellation takes effect at the end of the current billing cycle.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">4. Disclaimers</h2>
          <p>
            ViCareerAI provides content suggestions and resume formatting tools. We do not guarantee interview offers, hiring outcomes, or employment decisions made by prospective employers.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">5. Support</h2>
          <p>
            For inquiries or support, reach out to: <a href="mailto:emirkale03@gmail.com" className="font-mono underline text-zinc-900 dark:text-zinc-100">emirkale03@gmail.com</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
