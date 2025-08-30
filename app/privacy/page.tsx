export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Mobile-optimized header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <a 
            href="/" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Home
          </a>
        </div>
      </div>
      
      <div className="px-4 py-6 md:p-10">
        <div className="mx-auto max-w-3xl prose prose-slate">
        <h1>Privacy Policy</h1>
        <p><strong>Effective Date:</strong> December 2024</p>

        <h2>1. What We Collect</h2>
        <p>We only collect your email address for authentication, billing, and essential service communications.</p>

        <h2>2. How We Use Your Email</h2>
        <ul>
          <li>To verify your identity (magic link/OTP).</li>
          <li>To send essential account, billing, and educational updates.</li>
          <li>We will not sell, rent, or share your email.</li>
        </ul>

        <h2>3. Email Deliverability</h2>
        <p>Please add <code>support@zerofinanx.com</code> to your email whitelist so you don't miss important messages.</p>

        <h2>4. Jurisdiction</h2>
        <p>This policy is governed by the laws of Mumbai, Maharashtra, India.</p>

        <h2>5. Updates</h2>
        <p>We may update this policy from time to time. If changes are significant, we'll notify you by email.</p>
      </div>
    </main>
  );
}