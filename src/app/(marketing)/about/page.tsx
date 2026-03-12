import { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";
import { Star, AlertCircle, Clock, TrendingDown, Users, Lightbulb, Heart } from "lucide-react";

export const metadata: Metadata = {
    title: "About Openrize | Why We Built This",
    description: "The real story behind Openrize — born from frustration, penalties, and a determination to help business owners reclaim their reputation.",
};

export default function AboutPage() {
    const painPoints = [
        {
            icon: AlertCircle,
            color: "text-red-400",
            bg: "bg-red-400/10 border-red-400/20",
            title: "Fines & Penalties",
            desc: "Our founders worked in hospitality and retail, and watched businesses get penalized for failing to respond to negative reviews within required timeframes. One bad review left unanswered became a chain reaction.",
        },
        {
            icon: Clock,
            color: "text-amber-400",
            bg: "bg-amber-400/10 border-amber-400/20",
            title: "Constant Forgetfulness",
            desc: "Between staffing, inventory, and day-to-day operations, replying to reviews was always the thing that fell through the cracks. Out of sight, out of mind — until a customer called it out publicly.",
        },
        {
            icon: TrendingDown,
            color: "text-orange-400",
            bg: "bg-orange-400/10 border-orange-400/20",
            title: "Negative Business Impact",
            desc: "Unanswered reviews drove potential customers away. Star ratings dropped. Foot traffic declined. The compounding effect of manual, reactive reputation management was quietly destroying businesses we cared about.",
        },
        {
            icon: TrendingDown,
            color: "text-rose-400",
            bg: "bg-rose-400/10 border-rose-400/20",
            title: "Manual Work Overload",
            desc: "Hours every week spent copying and pasting replies, switching between Google, Yelp, TripAdvisor, and Booking.com tabs. It was costing owners their evenings — and their health.",
        },
    ];

    const team = [
        {
            name: "Harsh P.",
            role: "Co-Founder & CEO",
            emoji: "👨‍💼",
            bio: "Former hospitality operations lead. Watched multiple properties struggle with reputation management before deciding to build the solution he wished existed.",
        },
        {
            name: "Raj M.",
            role: "Co-Founder & CTO",
            emoji: "👨‍💻",
            bio: "Full-stack engineer with a background in AI and SaaS platforms. Turned the vision into reality by building the automation layer that makes Openrize possible.",
        },
        {
            name: "Priya S.",
            role: "Head of Customer Success",
            emoji: "👩‍🎯",
            bio: "Previously managed guest experience at a boutique hotel chain. Brings deep empathy for business owners and ensures every Openrize customer achieves real results.",
        },
    ];

    const milestones = [
        { year: "2023", event: "Openrize is founded after 3 years of seeing the same problems play out across hospitality and retail." },
        { year: "2024", event: "First 100 businesses onboarded. Automated response system built and tested with real hotel clients." },
        { year: "2025", event: "Expanded to serve restaurants, clinics, liquor stores, and multi-location retail chains." },
        { year: "2026", event: "1,500+ businesses actively using Openrize. AI-powered reply generation and competitor benchmarking launched." },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title="Why We Built Openrize"
                description="We didn't build this from a whiteboard. We built it from frustration."
            />

            <section className="container py-16 px-4 md:px-6 mx-auto space-y-24">

                {/* Origin Story */}
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                            <Lightbulb className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">The Origin Story</h2>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
                        <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                            We used to be the people sitting on the other side of this problem. Before Openrize, we worked in hospitality and retail — long hours, lean teams, and a constant flood of operational fires to put out.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Then one day, the reviews piled up. Not because the service was bad — but because there simply wasn't enough time to respond. A 1-star review sat unanswered for two weeks. Then a franchise penalty came down. Then another property's rating slipped below 4.0 on Google, and the booking numbers followed.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            We were sitting in a back office at 11 PM, eyes burning, copy-pasting the same response to a dozen reviews across four platforms — Google, TripAdvisor, Yelp, Booking.com — and thinking: <em>"There has to be a better way."</em>
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            There wasn't. Not one that was affordable, focused, and built for real business owners rather than enterprise marketing departments. So we built Openrize.
                        </p>
                    </div>
                </div>

                {/* Pain Points */}
                <div>
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-foreground mb-3">The Problems We Lived Through</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">These aren't hypothetical pain points from customer interviews. These are problems we personally experienced — and refused to accept.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {painPoints.map(({ icon: Icon, color, bg, title, desc }) => (
                            <div key={title} className={`rounded-2xl border p-6 ${bg}`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <Icon className={`w-5 h-5 ${color}`} />
                                    <h3 className={`font-bold ${color}`}>{title}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mission */}
                <div className="max-w-3xl mx-auto">
                    <div className="p-8 rounded-2xl border-l-4 border-primary bg-primary/5">
                        <div className="flex items-center gap-3 mb-4">
                            <Heart className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold text-foreground">Our Mission</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed italic text-lg">
                            "To give every business owner — from a family-run motel to a multi-location restaurant group — the tools to manage their reputation effortlessly, respond to every review, and turn customer feedback into real business growth."
                        </p>
                    </div>
                </div>

                {/* Timeline */}
                <div>
                    <h2 className="text-2xl font-bold text-foreground mb-10 text-center">Our Journey</h2>
                    <div className="max-w-2xl mx-auto space-y-4">
                        {milestones.map(({ year, event }) => (
                            <div key={year} className="flex items-start gap-5">
                                <div className="w-16 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0 mt-1">
                                    {year}
                                </div>
                                <p className="text-muted-foreground leading-relaxed text-sm pt-1">{event}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team */}
                <div>
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-foreground mb-3">The Team</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">People who got fed up with the problem and decided to become the solution.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {team.map(({ name, role, emoji, bio }) => (
                            <div key={name} className="rounded-2xl border border-border bg-card p-6 text-center hover:border-primary/30 transition-colors">
                                <div className="text-5xl mb-4">{emoji}</div>
                                <h3 className="font-bold text-foreground text-lg">{name}</h3>
                                <p className="text-xs text-primary font-medium mb-3">{role}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Closing CTA */}
                <div className="max-w-2xl mx-auto text-center">
                    <div className="flex justify-center mb-4">
                        {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-3">Join 1,500+ businesses already using Openrize</h2>
                    <p className="text-muted-foreground mb-6">Stop losing customers to unanswered reviews. Start building the reputation your business deserves.</p>
                    <a
                        href="/demo"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity"
                    >
                        <Users className="w-4 h-4" /> Request a Free Demo
                    </a>
                </div>

            </section>
        </div>
    );
}
