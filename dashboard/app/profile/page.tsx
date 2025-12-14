
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Save, Slack, Mail, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Config State
    const [slackConfig, setSlackConfig] = useState({
        webhookUrl: "",
        enabled: false,
        notifications: { highRisk: true, success: true }
    });

    const [emailConfig, setEmailConfig] = useState({
        enabled: false,
        frequency: "daily",
        time: "09:00"
    });

    useEffect(() => {
        if (session) {
            fetch("/api/user/profile")
                .then(res => res.json())
                .then(data => {
                    if (data.integrations) {
                        setSlackConfig(prev => ({ ...prev, ...data.integrations.slack }));
                        setEmailConfig(prev => ({ ...prev, ...data.integrations.emailDigest }));
                    }
                    setLoading(false);
                });
        }
    }, [session]);

    const handleSave = async () => {
        setSaving(true);
        await fetch("/api/user/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                slack: slackConfig,
                emailDigest: emailConfig
            })
        });
        setSaving(false);
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading profile...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">User Settings</h1>
                    <p className="text-gray-400">Manage your notification channels and integrations.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-500">
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Slack Integration */}
                <Card className="border-white/10 bg-[#0A0A0A]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Slack className="text-[#E01E5A]" /> Slack Integration
                        </CardTitle>
                        <CardDescription>Receive real-time alerts for critical vulnerabilities.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                            <span className="text-sm font-medium">Enable Notifications</span>
                            <input
                                type="checkbox"
                                checked={slackConfig.enabled}
                                onChange={(e) => setSlackConfig({ ...slackConfig, enabled: e.target.checked })}
                                className="toggle accent-emerald-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400 uppercase">Webhook URL</label>
                            <input
                                type="text"
                                placeholder="https://hooks.slack.com/services/..."
                                value={slackConfig.webhookUrl}
                                onChange={(e) => setSlackConfig({ ...slackConfig, webhookUrl: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
                            />
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="text-xs font-medium text-gray-400 uppercase">Notify On</label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm text-gray-300">
                                    <input
                                        type="checkbox"
                                        checked={slackConfig.notifications.highRisk}
                                        onChange={(e) => setSlackConfig({ ...slackConfig, notifications: { ...slackConfig.notifications, highRisk: e.target.checked } })}
                                    />
                                    High Risk Issues
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-300">
                                    <input
                                        type="checkbox"
                                        checked={slackConfig.notifications.success}
                                        onChange={(e) => setSlackConfig({ ...slackConfig, notifications: { ...slackConfig.notifications, success: e.target.checked } })}
                                    />
                                    Analysis Success
                                </label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Email Digest */}
                <Card className="border-white/10 bg-[#0A0A0A]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="text-blue-400" /> Email Digest
                        </CardTitle>
                        <CardDescription>Daily or weekly summary of repository health.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                            <span className="text-sm font-medium">Enable Digests</span>
                            <input
                                type="checkbox"
                                checked={emailConfig.enabled}
                                onChange={(e) => setEmailConfig({ ...emailConfig, enabled: e.target.checked })}
                                className="toggle accent-emerald-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 uppercase">Frequency</label>
                                <select
                                    value={emailConfig.frequency}
                                    onChange={(e) => setEmailConfig({ ...emailConfig, frequency: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-emerald-500 outline-none"
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 uppercase">Time</label>
                                <input
                                    type="time"
                                    value={emailConfig.time}
                                    onChange={(e) => setEmailConfig({ ...emailConfig, time: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-emerald-500 outline-none"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Monitored Repositories */}
            <Card className="border-white/10 bg-[#0A0A0A]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RefreshCw className="text-purple-400" /> Monitored Repositories
                    </CardTitle>
                    <CardDescription>Select repositories for automated daily scanning.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Simplified list for MVP - In real app, this would query GitHub API */}
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="owner/repo"
                                className="flex-1 bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-emerald-500 outline-none"
                            />
                            <Button className="bg-white/10 hover:bg-white/20 text-white">
                                Add
                            </Button>
                        </div>

                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {/* Mock Data for now, should map from state later */}
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                <span className="text-sm font-medium text-gray-300">agent-zero/core</span>
                                <div className="flex items-center gap-2">
                                    <Slack size={14} className="text-gray-500" />
                                    <Mail size={14} className="text-blue-400" />
                                    <span className="text-xs text-emerald-500">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* API Keys (ReadOnly View) */}
            <Card className="border-white/10 bg-[#0A0A0A] opacity-75">
                <CardHeader>
                    <CardTitle className="text-lg">System Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>Active AI Model</span>
                        <span className="text-emerald-400 font-mono">Gemini Pro (Multi-Key Rotation Active)</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
