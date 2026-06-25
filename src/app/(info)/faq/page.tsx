'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'What are the shipping times within India?',
    answer:
      'We ship across India with an average delivery time of 3-7 business days. Metro cities (Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Kolkata) typically receive orders in 3-4 business days. For remote areas and Northeast India, delivery may take 7-10 business days.',
  },
  {
    question: 'Is free shipping available?',
    answer:
      'Yes! We offer complimentary shipping on all orders above ₹2,000. For orders below this threshold, a flat shipping fee of ₹99 applies. All orders are fully tracked from dispatch to delivery.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major payment methods through Razorpay including UPI (Google Pay, PhonePe, Paytm), credit and debit cards (Visa, Mastercard, RuPay), net banking, and popular wallets. All transactions are secured with bank-level encryption.',
  },
  {
    question: 'Is Cash on Delivery (COD) available?',
    answer:
      'Currently, we do not offer Cash on Delivery. This helps us keep our prices fair and our operations sustainable. We support all digital payment methods through our secure Razorpay integration.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'We offer a 30-day hassle-free return policy. If you are not satisfied with your purchase, you can initiate a return within 30 days of delivery. Items must be unworn, unwashed, and in their original packaging with all tags attached. Refunds are processed within 5-7 business days to your original payment method.',
  },
  {
    question: 'Can I exchange an item for a different size?',
    answer:
      'Absolutely. If you need a different size, simply initiate a return for the original item and place a new order for the correct size. This ensures the fastest processing time. We are working on a direct exchange feature that will be available soon.',
  },
  {
    question: 'How do I track my order?',
    answer:
      'Once your order is dispatched, you will receive a tracking link via email and SMS. You can also track your order from your account dashboard under "My Orders". Real-time tracking updates are provided by our logistics partners.',
  },
  {
    question: 'How do I find the right size?',
    answer:
      'Each product page includes a detailed size guide with measurements in both inches and centimetres. We recommend measuring a garment that fits you well and comparing it with our size chart. If you are between sizes, we generally recommend sizing up for a relaxed fit.',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'At present, we ship within India only. International shipping is on our roadmap and will be available for select countries soon. Follow us on social media or subscribe to our newsletter for updates.',
  },
  {
    question: 'How can I contact customer support?',
    answer:
      'You can reach us at support@speffo.in or through the chat widget on our website. Our team is available Monday to Saturday, 10 AM to 7 PM IST. We aim to respond to all queries within 24 hours.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      <div className="mb-10">
        <span className="eyebrow text-clay">Help Centre</span>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-muted-foreground">
          Everything you need to know about shopping with Speffo.
        </p>
      </div>

      <div className="divide-y divide-border rounded-lg border">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-muted/50"
              >
                <span className="text-sm font-medium sm:text-base">{faq.question}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="shrink-0"
                >
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
