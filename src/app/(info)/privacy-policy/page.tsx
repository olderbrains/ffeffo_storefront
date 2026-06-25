import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Speffo',
  description:
    'Learn how Speffo collects, uses, and protects your personal information in compliance with Indian law.',
};

export default function PrivacyPolicyPage() {
  return (
    <article>
      <div className="mb-10">
        <span className="eyebrow text-clay">Legal</span>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: June 2026</p>
      </div>

      <div className="space-y-8 text-[15px] leading-relaxed text-muted-foreground">
        <section>
          <p>
            Speffo Retail Private Limited (&ldquo;Speffo&rdquo;, &ldquo;we&rdquo;,
            &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your
            information when you visit our website at{' '}
            <strong className="text-foreground">speffo.in</strong> and use our services.
          </p>
          <p className="mt-3">
            By accessing or using our services, you agree to the terms of this Privacy Policy.
            If you do not agree, please discontinue use of our services.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Information We Collect
          </h2>
          <p className="mt-3">We collect information that you provide directly, including:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Account information:</strong> Name, email
              address, phone number, and password when you register
            </li>
            <li>
              <strong className="text-foreground">Delivery details:</strong> Shipping
              addresses, pin codes, and contact numbers
            </li>
            <li>
              <strong className="text-foreground">Payment information:</strong> Transaction
              details processed securely through Razorpay (we do not store card numbers)
            </li>
            <li>
              <strong className="text-foreground">Communications:</strong> Messages sent to our
              support team and survey responses
            </li>
          </ul>
          <p className="mt-4">We automatically collect:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Device information (browser type, OS, screen resolution)</li>
            <li>IP address and approximate geographic location</li>
            <li>Pages visited, time spent, and navigation patterns</li>
            <li>Referring URLs and search terms</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            How We Use Your Information
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Process and fulfil your orders, including delivery and returns</li>
            <li>Send order confirmations, shipping updates, and tracking links</li>
            <li>Provide customer support and respond to your enquiries</li>
            <li>Personalise your shopping experience and product recommendations</li>
            <li>Prevent fraud and maintain account security</li>
            <li>Improve our website, services, and product offerings</li>
            <li>
              Send promotional communications (only with your consent — you may unsubscribe at
              any time)
            </li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Third-Party Services
          </h2>
          <p className="mt-3">
            We share information with trusted third parties only as necessary to operate our
            services:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Razorpay</strong> — Payment processing
            </li>
            <li>
              <strong className="text-foreground">Firebase (Google)</strong> — Authentication
              and analytics
            </li>
            <li>
              <strong className="text-foreground">Logistics partners</strong> (Delhivery,
              BlueDart, DTDC) — Order delivery
            </li>
            <li>
              <strong className="text-foreground">Cloud infrastructure</strong> (AWS) — Data
              hosting and storage
            </li>
          </ul>
          <p className="mt-3">
            These providers process data under their own privacy policies and contractual
            obligations to protect your information.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Cookies & Tracking
          </h2>
          <p className="mt-3">
            We use essential cookies for site functionality (login sessions, cart persistence)
            and analytics cookies to understand usage patterns. You may disable non-essential
            cookies through your browser settings, though this may affect certain features.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">Data Security</h2>
          <p className="mt-3">
            We implement industry-standard security measures including HTTPS encryption,
            secure server infrastructure, access controls, and regular security audits.
            Payment data is handled entirely by Razorpay&apos;s PCI-DSS compliant systems — we
            never store your full card details.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">Your Rights</h2>
          <p className="mt-3">
            Under the Information Technology Act, 2000 and the SPDI Rules, 2011, you have the
            right to:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Access your personal data held by us</li>
            <li>Correct inaccurate or incomplete data</li>
            <li>Withdraw consent for data processing</li>
            <li>Request deletion of your account and associated data</li>
          </ul>
          <p className="mt-3">
            To exercise these rights, email us at{' '}
            <a
              href="mailto:privacy@speffo.in"
              className="font-medium text-forest underline underline-offset-2"
            >
              privacy@speffo.in
            </a>
            . We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">Data Retention</h2>
          <p className="mt-3">
            We retain your personal information for as long as your account is active or as
            needed to provide services. Order and transaction records are retained for 8 years
            as required under Indian tax and accounting regulations. You may request account
            deletion at any time.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Changes to This Policy
          </h2>
          <p className="mt-3">
            We may update this Privacy Policy from time to time. Material changes will be
            communicated via email or a notice on our website. Your continued use of our
            services after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="rounded-lg border bg-sand-deep/30 p-6">
          <p className="text-sm text-foreground">
            Questions about your data? Contact our privacy team at{' '}
            <a
              href="mailto:privacy@speffo.in"
              className="font-medium text-forest underline underline-offset-2"
            >
              privacy@speffo.in
            </a>
          </p>
        </section>
      </div>
    </article>
  );
}
