
export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24 text-zinc-900 dark:text-zinc-100">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-zinc-500 mb-8">Last updated: October 2026</p>

      <section className="space-y-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">1. Information We Collect</h2>
          <p>
            When you register, we collect your email address and authentication credentials. When you create or upload resumes, we process your career information (work experience, education, skills) to provide AI editing and PDF generation services.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">2. How Your Data Is Processed</h2>
          <p>
            Your resume content is processed using OpenAI APIs strictly to generate suggestions, revisions, and keyword comparisons. Your personal data is never sold or used to train third-party public models.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">3. Data Storage & Deletion</h2>
          <p>
            Your account and documents are stored securely in our Supabase database with row-level security. You can delete your account and all associated data at any time from your profile settings.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">4. Contact</h2>
          <p>
            If you have any questions or data requests, contact us at: <a href="mailto:emirkale03@gmail.com" className="font-mono underline text-zinc-900 dark:text-zinc-100">emirkale03@gmail.com</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
