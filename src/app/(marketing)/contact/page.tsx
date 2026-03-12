import { Metadata } from "next";
import { Mail, Globe, Linkedin, Instagram } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

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
            value: "openize@gmail.com",
            href: "mailto:openize@gmail.com",
            display: "openize@gmail.com",
        },
        {
            icon: Globe,
            title: "Website",
            desc: "Visit our main site",
            value: "https://www.openrize.com",
            href: "https://www.openrize.com",
            display: "www.openrize.com",
        },
        {
            icon: Linkedin,
            title: "LinkedIn",
            desc: "Connect with us on LinkedIn",
            value: "linkedin.com/in/openrize",
            href: "https://www.linkedin.com/in/openrize/",
            display: "linkedin.com/in/openrize",
        },
        {
            icon: Instagram,
            title: "Instagram",
            desc: "Follow us on Instagram",
            value: "instagram.com/openrize",
            href: "https://www.instagram.com/?hl=en",
            display: "@openrize",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title="Get in Touch"
                description="Have questions? We're here to help. Reach out to our team anytime."
            />

            <section className="container py-24 px-4 md:px-6 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {contactCards.map(({ icon: Icon, title, desc, href, display }) => (
                        <Card key={title} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="flex flex-col items-center text-center p-8 space-y-4">
                                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Icon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{title}</h3>
                                    <p className="text-muted-foreground mb-4">{desc}</p>
                                    <a
                                        href={href}
                                        target={href.startsWith("http") ? "_blank" : undefined}
                                        rel="noopener noreferrer"
                                        className="text-primary font-medium hover:underline text-lg"
                                    >
                                        {display}
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="max-w-2xl mx-auto mt-16 p-8 rounded-2xl border border-border bg-secondary/20 text-center">
                    <h3 className="text-xl font-bold text-foreground mb-3">Response Time</h3>
                    <p className="text-muted-foreground">
                        We typically respond to all inquiries within <strong>24 business hours</strong>. For urgent platform issues, please include "URGENT" in your email subject line and we will prioritize your request.
                    </p>
                </div>
            </section>
        </div>
    );
}
