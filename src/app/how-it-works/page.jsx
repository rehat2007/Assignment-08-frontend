"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import HowItWorks from "@/components/how-it-works";
import SectionHeader from "@/components/section-header";
import { cn } from "cn";

const PAGE_STEPS = [
  {
    title: "Discover Spaces",
    description:
      "Search by category and location. Every listing shows its hourly rate, deposit and capacity.",
  },
  {
    title: "Select Shoot Hours",
    description:
      "Choose a date and time. Slots already confirmed by other creators cannot be selected.",
  },
  {
    title: "Book Instantly",
    description:
      "Send the request. You see the total before you confirm, and the host replies within an hour.",
  },
  {
    title: "Create & Produce",
    description:
      "Show up, shoot and leave a review. Your deposit is released after check-out.",
  },
];

const FAQS = [
  {
    question: "When is the deposit returned?",
    answer:
      "Deposits are released after check-out once the host confirms the space was left in order — usually within 24 hours of your session.",
  },
  {
    question: "Can I cancel a booking?",
    answer:
      "Yes. Cancel more than 48 hours before your slot for a full refund. Later cancellations keep a small fee that compensates the host for held time.",
  },
  {
    question: "What happens if two people want the same slot?",
    answer:
      "The first confirmed booking wins and the slot is blocked instantly. Newer requests for the same slot are notified and offered the nearest alternatives.",
  },
  {
    question: "How do I list my own studio?",
    answer:
      "Register as a host, add your room details, pricing and availability, and confirm the equipment safety checklist. Your listing goes live after a quick review.",
  },
];

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  function toggle(index) {
    setOpenIndex((current) => (current === index ? null : index));
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <SectionHeader as="h1" eyebrow="Questions" title="Before you book" />

        <div className="mt-8" role="presentation">
          {FAQS.map(({ question, answer }, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;

            return (
              <div key={question} className="border-border border-t">
                <h2>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 hover:text-brand"
                  >
                    {question}
                    <ChevronDown
                      className={cn(
                        "text-muted-foreground size-4 shrink-0 transition-transform",
                        isOpen && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </h2>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    className="text-muted-foreground pb-5 text-sm leading-relaxed"
                  >
                    {answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function HowItWorksPage() {
  return (
    <main>
      <HowItWorks
        eyebrow="How It Works"
        title="Booking a studio takes four steps"
        description="Hosts set the price and availability. You pick the hours. StudioSpace holds the deposit until the shoot is done."
        steps={PAGE_STEPS}
        headingLevel="h1"
      />
      <FaqSection />
    </main>
  );
}
