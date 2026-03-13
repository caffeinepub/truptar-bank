import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do I open an account?",
    a: "You can open an account online by filling out our account application form, or visit any of our branch locations with a valid government-issued ID.",
  },
  {
    q: "What types of accounts does TRUPTAR Bank offer?",
    a: "We offer personal savings, personal checking, fixed/term deposits, business checking, and business savings accounts.",
  },
  {
    q: "Is my money insured?",
    a: "Yes. All deposits at TRUPTAR Bank are FDIC insured up to $250,000 per depositor.",
  },
  {
    q: "How do I apply for a loan?",
    a: "You can apply for any loan online through our Loan Application page, or schedule an appointment with one of our loan officers at any branch.",
  },
  {
    q: "What are your customer service hours?",
    a: "Our phone and email support is available Monday\u2013Friday 8:00 AM to 6:00 PM and Saturday 9:00 AM to 2:00 PM.",
  },
  {
    q: "Does TRUPTAR Bank have mobile banking?",
    a: "Yes! We have a full-featured mobile app available for both iOS and Android, with mobile deposit, transfers, bill pay, and account alerts.",
  },
  {
    q: "How do I report a lost or stolen debit card?",
    a: "Call us immediately at +1 (402) 627-0793 or use the freeze card feature in your online banking dashboard to instantly disable your card.",
  },
  {
    q: "What community programs does TRUPTAR Bank offer?",
    a: "We run several programs including small business funding, financial literacy workshops, youth savings initiatives, and community development grants. Visit our Community Programs page for details.",
  },
  {
    q: "Are there fees for online banking?",
    a: "No. Online banking and the mobile app are provided free of charge to all account holders.",
  },
  {
    q: "How do I contact the bank?",
    a: "You can call us at +1 (402) 627-0793, email ikehsopuruchukwu@gmail.com, or visit any of our three branch locations in the Omaha metro area.",
  },
];

export default function FAQPage() {
  return (
    <div>
      <section className="bg-bank-navy py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
          <h1 className="font-display text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-white/70 text-lg">
            Find answers to common questions about TRUPTAR Bank.
          </p>
        </div>
      </section>
      <section className="py-16 bg-white" data-ocid="faq.section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`faq-${i}`}
                className="border border-border rounded-lg px-4"
                data-ocid={`faq.item.${i + 1}`}
              >
                <AccordionTrigger className="text-bank-navy font-semibold text-left">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
