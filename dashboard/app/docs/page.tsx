
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, Book, Shield, Zap, Layers, Bot, Code2 } from 'lucide-react';

export default function DocsOverview() {
    const sections = [
        {
            title: "Getting Started",
            description: "Install the extension, sign in with GitHub, and run your first explanation.",
            href: "/docs/setup",
            icon: Zap
        },
        {
            title: "Core Concepts",
            description: "Learn about the Side Panel, Code Selection, and Keyboard-first workflows.",
            href: "/docs/concepts",
            icon: Layers
        },
        {
            title: "Kestra Integration",
            description: "Deep dive into our event-driven orchestration with Kestra.",
            href: "/docs/kestra",
            icon: Bot
        },
        {
            title: "Cline CLI Agent",
            description: "How we use Cline for autonomous code refactoring and updates.",
            href: "/docs/cline",
            icon: Code2
        },
        {
            title: "Security & Privacy",
            description: "Understanding data handling, permissions, and GitHub OAuth.",
            href: "/docs/security",
            icon: Shield
        },
        {
            title: "API Reference",
            description: "Endpoints for Analysis, MCS Scoring, and History.",
            href: "/docs/api",
            icon: Book
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Documentation
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl">
                    Explain GitHub code and pull request diffs with context — without leaving the page.
                    Powered by Agent Zero.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section) => (
                    <Link key={section.href} href={section.href} className="group">
                        <Card className="h-full bg-white/5 border-white/10 group-hover:border-emerald-500/50 transition-all duration-300">
                            <CardHeader>
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-500 group-hover:scale-110 transition-transform">
                                    <section.icon size={24} />
                                </div>
                                <CardTitle className="group-hover:text-emerald-400 transition-colors">
                                    {section.title}
                                </CardTitle>
                                <CardDescription>
                                    {section.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
