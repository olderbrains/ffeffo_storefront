import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | Speffo',
  description:
    'Learn about Speffo shipping times, delivery partners, and free shipping thresholds across India.',
};

export default function ShippingPolicyPage() {
  return (
    <article>
      <div className="mb-10">
        <span className="eyebrow text-clay">Policies</span>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          Shipping Policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: June 2026</p>
      </div>

      <div className="space-y-8 text-[15px] leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">Domestic Shipping</h2>
          <p className="mt-3">
            Speffo ships to all serviceable pin codes across India. We partner with leading
            logistics providers to ensure your orders arrive safely and on time.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Metro cities</strong> (Delhi NCR, Mumbai,
              Bangalore, Chennai, Hyderabad, Kolkata): 3-4 business days
            </li>
            <li>
              <strong className="text-foreground">Tier-2 cities:</strong> 4-6 business days
            </li>
            <li>
              <strong className="text-foreground">Remote & Northeast regions:</strong> 7-10
              business days
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Free Shipping Threshold
          </h2>
          <p className="mt-3">
            Orders above <strong className="text-foreground">{'₹'}2,000</strong> qualify for
            complimentary standard shipping. For orders below this amount, a flat fee of{' '}
            <strong className="text-foreground">{'₹'}99</strong> is charged at checkout.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">Order Processing</h2>
          <p className="mt-3">
            Orders placed before 2 PM IST on business days (Monday to Saturday) are processed
            the same day. Orders placed after 2 PM or on Sundays and public holidays are
            processed on the next business day. You will receive a confirmation email with your
            tracking details once your order is dispatched.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Tracking Your Order
          </h2>
          <p className="mt-3">
            A tracking link is sent via email and SMS once your order ships. You can also view
            real-time tracking status from your account under &ldquo;My Orders&rdquo;. If your
            tracking has not updated in over 48 hours, please contact our support team.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">Shipping Partners</h2>
          <p className="mt-3">
            We work with Delhivery, BlueDart, and DTDC to provide reliable delivery coverage
            across India. The specific courier assigned depends on your pin code and order
            weight for optimal speed.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Delays & Unforeseen Events
          </h2>
          <p className="mt-3">
            While we strive to meet the estimated delivery timelines, occasional delays may
            occur due to adverse weather, regional disturbances, logistics disruptions, or high
            order volumes during sale events. In such cases, we will proactively notify you via
            email with revised timelines.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            International Shipping
          </h2>
          <p className="mt-3">
            We currently ship within India only. International shipping to select countries is
            planned for the near future. Subscribe to our newsletter for updates.
          </p>
        </section>

        <section className="rounded-lg border bg-sand-deep/30 p-6">
          <p className="text-sm text-foreground">
            Have questions about your shipment? Reach out at{' '}
            <a
              href="mailto:support@speffo.in"
              className="font-medium text-forest underline underline-offset-2"
            >
              support@speffo.in
            </a>
          </p>
        </section>
      </div>
    </article>
  );
}
