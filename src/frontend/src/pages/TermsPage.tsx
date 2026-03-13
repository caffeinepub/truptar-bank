const termsSections = [
  {
    title: "1. Acceptance of Terms",
    text: "By opening an account or using TRUPTAR Bank's services, you agree to these Terms of Service. If you do not agree, please do not use our services.",
  },
  {
    title: "2. Account Eligibility",
    text: "You must be at least 18 years old (or 13 with parental consent for youth accounts), a U.S. resident, and provide accurate identification information.",
  },
  {
    title: "3. Account Responsibilities",
    text: "You are responsible for maintaining the confidentiality of your login credentials and for all activity on your account. Notify us immediately of any unauthorized access.",
  },
  {
    title: "4. Fees",
    text: "Applicable fees are disclosed in your account agreement. We reserve the right to change fees with 30 days' advance notice.",
  },
  {
    title: "5. Electronic Communications",
    text: "By providing an email address, you consent to receive account statements, notices, and disclosures electronically.",
  },
  {
    title: "6. Limitation of Liability",
    text: "TRUPTAR Bank is not liable for indirect, incidental, or consequential damages arising from your use of our services, except as required by law.",
  },
  {
    title: "7. Governing Law",
    text: "These terms are governed by the laws of the State of Nebraska and applicable federal law.",
  },
  {
    title: "8. Contact",
    text: "Questions about these terms? Contact us at ikehsopuruchukwu@gmail.com or +1 (402) 627-0793.",
  },
];

export default function TermsPage() {
  return (
    <div>
      <section className="bg-bank-navy py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-block w-12 h-0.5 bg-bank-gold mb-4" />
          <h1 className="font-display text-4xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-white/70">Last updated: January 1, 2025</p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {termsSections.map((s) => (
            <div key={s.title} className="mb-6">
              <h2 className="font-display text-xl font-bold text-bank-navy mb-2">
                {s.title}
              </h2>
              <p className="text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
