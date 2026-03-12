import { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";

export const metadata: Metadata = {
    title: "Terms & Conditions | Openrize",
    description: "Read the Terms and Conditions governing your use of Openrize's review management platform.",
};

export default function TermsPage() {
    const lastUpdated = "March 1, 2026";

    const sections = [
        {
            title: "1. Acceptance of Terms",
            content: `By accessing or using the Openrize platform ("Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, you may not access or use the Service.

These Terms apply to all users of the Service, including businesses, their staff members, and administrators. If you are using the Service on behalf of a business, you represent that you have authority to bind that business to these Terms.`,
        },
        {
            title: "2. Description of Service",
            content: `Openrize provides a cloud-based review management platform that enables businesses to:

• Monitor and respond to customer reviews from multiple platforms.
• Automate review request campaigns via email, SMS, and QR codes.
• Analyze review sentiment, trends, and competitor benchmarks.
• Manage internal operational tasks derived from customer feedback.
• Engage with customers through a branded public review page.

We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice.`,
        },
        {
            title: "3. Account Registration & Security",
            content: `To access the Service, you must create an account. You agree to:

• Provide accurate, current, and complete information during registration.
• Maintain the security of your account credentials and not share them with unauthorized parties.
• Notify us immediately at openize@gmail.com if you suspect any unauthorized access to your account.
• Accept responsibility for all activity that occurs under your account.

We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.`,
        },
        {
            title: "4. Subscriptions & Payments",
            content: `Openrize offers various subscription plans:

• **Free Trial:** A limited-feature trial may be available for a set number of days without charge.
• **Paid Plans:** After the trial, continued access requires a paid subscription at the rates listed on our Pricing page.
• **Billing:** Subscriptions are billed in advance on a monthly or annual basis depending on the plan selected.
• **Cancellations:** You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period; no partial refunds are issued.
• **Price Changes:** We will provide at least 30 days' notice before any price increase takes effect.

All fees are exclusive of applicable taxes, which may be added to your invoice.`,
        },
        {
            title: "5. Acceptable Use Policy",
            content: `You agree NOT to use the Service to:

• Violate any applicable laws, regulations, or third-party rights.
• Post false, misleading, defamatory, or fraudulent content or reviews.
• Spam, harass, or engage in abusive behavior toward other users or customers.
• Attempt to reverse-engineer, decompile, or extract source code from the Service.
• Use automated bots or scrapers to access the Service without authorization.
• Impersonate another person, business, or entity.
• Interfere with the integrity or performance of the Service or servers.

Violation of this policy may result in immediate account termination without refund.`,
        },
        {
            title: "6. Intellectual Property",
            content: `All content, features, and functionality of the Openrize platform — including but not limited to software, text, graphics, logos, and user interface design — are owned by or licensed to Openrize and are protected by copyright, trademark, and other intellectual property laws.

You are granted a limited, non-exclusive, non-transferable license to use the Service solely for your business's internal purposes in accordance with these Terms. You may not use our name, logo, or branding without prior written consent.`,
        },
        {
            title: "7. User-Generated Content",
            content: `You retain ownership of any content you submit to the Service (such as review responses, business descriptions, and task notes). By submitting content, you grant Openrize a non-exclusive, worldwide, royalty-free license to use, reproduce, and display such content solely for the purpose of operating and improving the Service.

You are solely responsible for the content you submit and represent that you have all necessary rights to do so. We reserve the right to remove any content that violates these Terms or our policies.`,
        },
        {
            title: "8. Third-Party Integrations",
            content: `The Service may integrate with third-party platforms such as Google, TripAdvisor, and Yelp. These integrations are subject to the respective third-party terms of service. Openrize is not responsible for the content, availability, or practices of third-party platforms.

We may discontinue or modify third-party integrations at any time, with or without notice, if the third party changes their policies or APIs.`,
        },
        {
            title: "9. Disclaimers & Limitation of Liability",
            content: `The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of viruses.

To the fullest extent permitted by law, Openrize shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of or inability to use the Service.

Our total liability to you for any claims arising from these Terms or the Service shall not exceed the amount you paid to Openrize in the 12 months preceding the event giving rise to liability.`,
        },
        {
            title: "10. Governing Law & Disputes",
            content: `These Terms are governed by and construed in accordance with the laws of the State of Illinois, United States, without regard to its conflict of law provisions.

Any dispute arising out of or relating to these Terms or the Service shall first be attempted to be resolved through good-faith negotiation. If unresolved, disputes shall be submitted to binding arbitration in Cook County, Illinois, in accordance with the American Arbitration Association rules.`,
        },
        {
            title: "11. Changes to Terms",
            content: `We may update these Terms from time to time. We will notify you of material changes via email or a notice on the platform at least 30 days in advance. Your continued use of the Service after the effective date constitutes acceptance of the updated Terms.`,
        },
        {
            title: "12. Contact",
            content: `For questions or concerns about these Terms, please contact:

**Openrize**
Email: openize@gmail.com`,
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title="Terms & Conditions"
                description={`Last updated: ${lastUpdated}`}
            />

            <section className="container py-16 px-4 md:px-6 mx-auto">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-10 p-6 rounded-2xl bg-primary/5 border border-primary/20">
                        <p className="text-foreground leading-relaxed">
                            Please read these Terms and Conditions carefully before using the Openrize platform. These Terms constitute a legal agreement between you and <strong>Openrize</strong> governing your access to and use of our services.
                        </p>
                    </div>

                    <div className="space-y-10">
                        {sections.map((section) => (
                            <div key={section.title} className="scroll-mt-20">
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
                            Questions about these Terms? Contact us at{" "}
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
