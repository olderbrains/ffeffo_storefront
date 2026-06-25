import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Speffo',
  description:
    'Read the terms and conditions governing your use of the Speffo platform and services.',
};

export default function TermsPage() {
  return (
    <article>
      <div className="mb-10">
        <span className="eyebrow text-clay">Legal</span>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: June 2026</p>
      </div>

      <div className="space-y-8 text-[15px] leading-relaxed text-muted-foreground">
        <section>
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the website
            operated by Speffo Retail Private Limited (&ldquo;Speffo&rdquo;, &ldquo;we&rdquo;,
            &ldquo;our&rdquo;, or &ldquo;us&rdquo;), accessible at{' '}
            <strong className="text-foreground">speffo.in</strong>. By accessing or using our
            platform, you agree to be bound by these Terms.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">Eligibility</h2>
          <p className="mt-3">
            You must be at least 18 years of age to create an account and make purchases on
            Speffo. By using our services, you represent that you meet this age requirement
            and have the legal capacity to enter into a binding agreement.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Account Responsibility
          </h2>
          <p className="mt-3">
            You are responsible for maintaining the confidentiality of your account credentials
            and for all activities conducted under your account. You agree to notify us
            immediately of any unauthorised access. Speffo is not liable for any loss arising
            from unauthorised use of your account.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Products & Pricing
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              All product descriptions, images, and specifications are provided in good faith
              but may contain minor inaccuracies. Colours may appear differently depending on
              your display.
            </li>
            <li>
              Prices are listed in Indian Rupees (INR) and are inclusive of applicable GST
              unless stated otherwise.
            </li>
            <li>
              We reserve the right to modify prices at any time without prior notice. The
              price at the time of order placement applies to your purchase.
            </li>
            <li>
              In the event of a pricing error, we reserve the right to cancel the order and
              issue a full refund.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Orders & Payment
          </h2>
          <p className="mt-3">
            Placing an order constitutes an offer to purchase. We reserve the right to accept
            or decline any order. Accepted orders are confirmed via email. Payments are
            processed securely through Razorpay. By making a payment, you confirm that the
            payment method used belongs to you or that you are authorised to use it.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Intellectual Property
          </h2>
          <p className="mt-3">
            All content on this website — including but not limited to text, graphics,
            photographs, logos, icons, software, and compilation of data — is the property of
            Speffo Retail Private Limited or its licensors and is protected by Indian and
            international copyright, trademark, and intellectual property laws.
          </p>
          <p className="mt-3">
            You may not reproduce, distribute, modify, or create derivative works from any
            content without our prior written consent.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Prohibited Conduct
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Using the platform for any unlawful purpose</li>
            <li>Attempting to gain unauthorised access to our systems or other user accounts</li>
            <li>Scraping, data mining, or automated extraction of website content</li>
            <li>Submitting false information or fraudulent orders</li>
            <li>Interfering with the proper functioning of the website</li>
            <li>Reselling products purchased from Speffo without authorisation</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Limitation of Liability
          </h2>
          <p className="mt-3">
            To the maximum extent permitted by law, Speffo and its directors, employees, and
            agents shall not be liable for any indirect, incidental, special, consequential,
            or punitive damages arising from your use of our services. Our total liability
            shall not exceed the amount you paid for the specific product or service giving
            rise to the claim.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">Indemnification</h2>
          <p className="mt-3">
            You agree to indemnify and hold harmless Speffo, its officers, directors,
            employees, and agents from any claims, liabilities, damages, losses, and expenses
            (including legal fees) arising from your violation of these Terms or your use of
            our services.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Governing Law & Jurisdiction
          </h2>
          <p className="mt-3">
            These Terms are governed by and construed in accordance with the laws of India.
            Any disputes arising from or related to these Terms shall be subject to the
            exclusive jurisdiction of the courts in Bengaluru, Karnataka, India.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Dispute Resolution
          </h2>
          <p className="mt-3">
            In the event of any dispute, the parties shall first attempt to resolve the matter
            amicably through good-faith negotiation. If unresolved within 30 days, the
            dispute shall be referred to arbitration under the Arbitration and Conciliation
            Act, 1996, with a sole arbitrator appointed mutually. The seat of arbitration
            shall be Bengaluru and proceedings shall be conducted in English.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Modifications to Terms
          </h2>
          <p className="mt-3">
            We reserve the right to modify these Terms at any time. Material changes will be
            communicated via email or a prominent notice on our website at least 7 days prior
            to taking effect. Your continued use of the platform after changes take effect
            constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section className="rounded-lg border bg-sand-deep/30 p-6">
          <p className="text-sm text-foreground">
            Questions about these terms? Contact us at{' '}
            <a
              href="mailto:legal@speffo.in"
              className="font-medium text-forest underline underline-offset-2"
            >
              legal@speffo.in
            </a>
          </p>
        </section>
      </div>
    </article>
  );
}
