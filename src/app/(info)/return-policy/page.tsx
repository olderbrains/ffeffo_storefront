import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Return & Refund Policy | Speffo',
  description:
    'Speffo offers a 7-day hassle-free return policy. Learn about eligibility, process, and refund timelines.',
};

export default function ReturnPolicyPage() {
  return (
    <article>
      <div className="mb-10">
        <span className="eyebrow text-clay">Policies</span>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          Return & Refund Policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: June 2026</p>
      </div>

      <div className="space-y-8 text-[15px] leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            7-Day Return Window
          </h2>
          <p className="mt-3">
            We want you to love every piece you buy from Speffo. If something does not work
            out, you may initiate a return within <strong className="text-foreground">30 days</strong>{' '}
            of delivery. Items must meet the eligibility conditions outlined below.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Eligibility Conditions
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Item must be unworn, unwashed, and free of stains, perfume, or deodorant marks</li>
            <li>All original tags, labels, and packaging must be intact</li>
            <li>The item must be in its original condition as received</li>
            <li>Proof of purchase (order confirmation email) is required</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Non-Returnable Items
          </h2>
          <p className="mt-3">The following categories are not eligible for returns:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Innerwear, lingerie, and swimwear (for hygiene reasons)</li>
            <li>Customised or personalised products</li>
            <li>Items purchased during clearance sales at 50% or more discount</li>
            <li>Gift cards and vouchers</li>
            <li>Items marked as &ldquo;Final Sale&rdquo; on the product page</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            How to Initiate a Return
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>Log in to your account and navigate to &ldquo;My Orders&rdquo;</li>
            <li>Select the order and item you wish to return</li>
            <li>Choose a reason for return and submit the request</li>
            <li>
              You will receive a confirmation email with pickup scheduling details within 24
              hours
            </li>
            <li>
              Pack the item securely in its original packaging and hand it to the pickup agent
            </li>
          </ol>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">Refund Process</h2>
          <p className="mt-3">
            Once we receive and inspect the returned item, your refund will be processed:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">UPI / Wallet payments:</strong> Refunded
              within 2-3 business days
            </li>
            <li>
              <strong className="text-foreground">Credit / Debit cards:</strong> Refunded
              within 5-7 business days (depends on your bank)
            </li>
            <li>
              <strong className="text-foreground">Net Banking:</strong> Refunded within 5-7
              business days
            </li>
          </ul>
          <p className="mt-3">
            All refunds are processed through Razorpay to your original payment method. You
            will receive a confirmation email once the refund is initiated.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Damaged or Defective Items
          </h2>
          <p className="mt-3">
            If you receive a damaged, defective, or wrong item, please contact us within 48
            hours of delivery with photographs. We will arrange an immediate replacement or
            full refund at no additional cost, including return shipping.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Return Shipping Costs
          </h2>
          <p className="mt-3">
            Return pickup is <strong className="text-foreground">free</strong> for all
            eligible returns within India. We arrange the reverse logistics — you do not need
            to ship the item yourself.
          </p>
        </section>

        <section className="rounded-lg border bg-sand-deep/30 p-6">
          <p className="text-sm text-foreground">
            Need help with a return? Contact us at{' '}
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
