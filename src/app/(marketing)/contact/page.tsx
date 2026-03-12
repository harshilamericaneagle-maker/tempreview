import { Metadata } from "next";
import { Mail, Globe, Linkedin, Instagram } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";

export const metadata: Metadata = {
    title: "Contact Openrize | Support and Sales",
    description: "Contact our team for support or sales inquiries.",
};

export default function ContactPage() {
    const contactCards = [
        {
            icon: Mail,
            title: "Email Us",
            desc: "General inquiries, support & sales",
            href: "mailto:openize@gmail.com",
            display: "openize@gmail.com",
            gradient: "from-violet-500 to-purple-600",
        },
        {
            icon: Globe,
            title: "Website",
            desc: "Visit our main site",
            href: "https://www.openrize.com",
            display: "www.openrize.com",
            gradient: "from-cyan-500 to-blue-600",
        },
        {
            icon: Linkedin,
            title: "LinkedIn",
            desc: "Connect with us on LinkedIn",
            href: "https://www.linkedin.com/in/openrize/",
            display: "linkedin.com/in/openrize",
            gradient: "from-blue-500 to-blue-700",
        },
        {
            icon: Instagram,
            title: "Instagram",
            desc: "Follow us on Instagram",
            href: "https://www.instagram.com/?hl=en",
            display: "@openrize",
            gradient: "from-pink-500 to-rose-600",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title="Get in Touch"
                description="Have questions? We're here to help. Reach out to our team anytime."
            />

            <section className="w-full py-16 px-6 lg:px-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                    {contactCards.map(({ icon: Icon, title, desc, href, display, gradient }) => (
                        <a
                            key={title}
                            href={href}
                            target={href.startsWith("http") ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="group rounded-2xl border border-border bg-card p-8 flex flex-col items-center text-center hover:border-primary/40 transition-all hover:shadow-lg"
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                <Icon className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{desc}</p>
                            <span className="text-primary font-semibold text-sm group-hover:underline">{display}</span>
                        </a>
                    ))}
                </div>

                <div className="rounded-2xl border border-border bg-secondary/20 p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">Response Time</h3>
                        <p className="text-muted-foreground max-w-lg">
                            We typically respond to all inquiries within <strong className="text-foreground">24 business hours</strong>. For urgent platform issues, include "URGENT" in your email subject line and we will prioritize your request.
                        </p>
                    </div>
                    <a
                        href="mailto:openize@gmail.com"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap flex-shrink-0"
                    >
                        <Mail className="w-4 h-4" /> Send Us a Message
                    </a>
                </div>
            </section>
        </div>
    );
}
