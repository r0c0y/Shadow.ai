
"use client";

import { CheckCircle, AlertTriangle, XCircle, Activity } from "lucide-react";
import clsx from "clsx";

interface MCSCardProps {
    score: number;
}

export default function MCSCard({ score }: MCSCardProps) {
    let status = "NEEDS_REVIEW";
    let colorClass = "text-amber-500";
    let bgClass = "bg-amber-500/10";
    let borderClass = "border-amber-500/20";

    if (score >= 80) {
        status = "MERGE_CANDIDATE";
        colorClass = "text-emerald-500";
        bgClass = "bg-emerald-500/10";
        borderClass = "border-emerald-500/20";
    } else if (score < 50) {
        status = "AUTOCORRECT";
        colorClass = "text-blue-500";
        bgClass = "bg-blue-500/10";
        borderClass = "border-blue-500/20";
    }

    return (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[250px] shadow-sm">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-6 z-10">Merge Confidence Score</h3>

            <div className="relative z-10 flex flex-col items-center">
                <span className={clsx("text-6xl font-bold mb-2", colorClass)}>
                    {score}
                </span>
                <span className="text-sm text-slate-500">out of 100</span>
            </div>

            <div className={clsx("mt-8 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wide z-10", bgClass, borderClass, colorClass)}>
                {status.replace("_", " ")}
            </div>

            {/* Simple Background Decoration */}
            <div className={clsx("absolute -bottom-20 -right-20 w-48 h-48 rounded-full blur-[80px] opacity-20",
                score >= 80 ? "bg-emerald-500" : score < 50 ? "bg-blue-500" : "bg-amber-500")}
            />
        </div>
    );
}
