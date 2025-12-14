import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
    executionId: {
        type: String,
        required: true,
        unique: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        required: true,
    },
    metrics: {
        type: Object,
        default: {},
    },
    ai_analysis: {
        score: Number,
        reasoning: String,
        verdict: String,
    },
    jira_ticket: {
        key: String,
        url: String,
    },
    pr_details: {
        number: String,
        url: String,
    },
}, { timestamps: true });

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
