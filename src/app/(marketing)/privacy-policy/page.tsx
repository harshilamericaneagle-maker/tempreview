import { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";

export const metadata: Metadata = {
    title: "Privacy Policy | Openrize",
    description: "Learn how Openrize collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
    const lastUpdated = "March 1, 2026";

    const sections = [
        {
            title: "1. Information We Collect",
            content: `We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This includes:
            
• **Account Information:** Name, email address, business name, phone number, and password when you register.
• **Business Data:** Reviews, responses, and analytics data associated with your business profile.
• **Usage Data:** Information about how you interact with our platform, including features used, pages visited, and actions taken.
• **Device & Log Data:** IP address, browser type, operating system, referring URLs, and timestamps.
• **Payment Information:** Billing details processed securely through our payment providers (we do not store full card numbers).`,
        },
        {
            title: "2. How We Use Your Information",
            content: `We use the information we collect to:

• Provide, maintain, and improve our review management services.
• Send you transactional emails, review alerts, and platform notifications.
• Process payments and manage your subscription.
• Respond to your comments, questions, and support requests.
• Monitor and analyze usage patterns to enhance user experience.
• Detect, investigate, and prevent fraudulent or unauthorized activity.
• Comply with legal obligations and enforce our Terms of Service.`,
        },
        {
            title: "3. Sharing of Information",
            content: `We do not sell, trade, or rent your personal information to third parties. We may share your information in the following limited circumstances:

• **Service Providers:** Trusted third-party vendors who assist us in operating our platform (e.g., payment processors, cloud hosting, email delivery). They are bound by confidentiality agreements.
• **Legal Requirements:** When required by law, subpoena, or other legal process, or when we believe disclosure is necessary to protect our rights or comply with a judicial proceeding.
• **Business Transfers:** In connection with a merger, acquisition, or sale of all or a portion of our assets.
• **With Your Consent:** In any other circumstances where you have provided explicit consent.`,
        },
        {
            title: "4. Data Security",
            content: `We implement industry-standard security measures to protect your information:

• All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.
• Regular security audits and penetration testing are conducted.
• Access to your data is restricted to authorized personnel only on a need-to-know basis.
• We maintain incident response procedures and will notify you promptly of any breach affecting your data.

However, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and keep your login credentials confidential.`,
        },
        {
            title: "5. Cookies & Tracking Technologies",
            content: `We use cookies and similar tracking technologies to:

• Keep you signed in to your account.
• Remember your preferences and settings.
• Understand how our service is being used.
• Improve performance and deliver relevant content.

You can control cookie settings through your browser preferences. Disabling cookies may affect certain features of our platform. We do not support "Do Not Track" signals at this time.`,
        },
        {
            title: "6. Data Retention",
            content: `We retain your personal information for as long as your account is active or as needed to provide you services. If you close your account, we will delete or anonymize your data within 90 days, unless we are required by law to retain it longer.

Review data attributed to your business profile may be retained in anonymized form for platform analytics purposes.`,
        },
        {
            title: "7. Your Rights",
            content: `Depending on your location, you may have the following rights regarding your personal data:

• **Access:** Request a copy of the personal information we hold about you.
• **Correction:** Request that we correct inaccurate or incomplete information.
• **Deletion:** Request deletion of your personal information, subject to legal obligations.
• **Portability:** Request your data in a machine-readable format.
• **Objection:** Object to certain types of processing, including marketing.

To exercise any of these rights, contact us at openize@gmail.com. We will respond within 30 days.`,
        },
        {
            title: "8. Children's Privacy",
            content: `Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will take steps to delete it promptly. If you believe we may have collected information from a child, please contact us at openize@gmail.com.`,
        },
        {
            title: "9. Changes to This Policy",
            content: `We may update this Privacy Policy from time to time. When we make significant changes, we will notify you by email or through a prominent notice on our platform at least 30 days before the changes take effect. Your continued use of our services after the effective date constitutes your acceptance of the updated policy.`,
        },
        {
            title: "10. Contact Us",
            content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

**Openrize**
Email: openize@gmail.com
LinkedIn: linkedin.com/in/openrize
Instagram: instagram.com/openrize`,
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title="Privacy Policy"
                description={`Last updated: ${lastUpdated}`}
            />

            <section className="container py-16 px-4 md:px-6 mx-auto">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-10 p-6 rounded-2xl bg-primary/5 border border-primary/20">
                        <p className="text-foreground leading-relaxed">
                            At <strong>Openrize</strong>, your privacy is a top priority. This Privacy Policy explains how we collect, use, disclose, and protect information about you when you use our review management platform and related services. By using Openrize, you agree to the practices described in this policy.
                        </p>
                    </div>

                    <div className="space-y-10">
                        {sections.map((section) => (
                            <div key={section.title} className="scroll-mt-20" id={section.title.replace(/\s+/g, "-").toLowerCase()}>
                                <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b border-border">
                                    {section.title}
                                </h2>
                                <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
                                    {section.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 p-6 rounded-2xl border border-border bg-secondary/20 text-center">
                        <p className="text-sm text-muted-foreground">
                            Questions about this policy? Contact us at{" "}
                            <a href="mailto:openize@gmail.com" className="text-primary font-medium hover:underline">
                                openize@gmail.com
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
