
import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
    },
    repo: String,
    file: String,
    type: {
        type: String, // 'explanation', 'security', 'diff'
        default: 'explanation'
    },
    summary: String,
    timestamp: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

export default mongoose.models.History || mongoose.model('History', HistorySchema);
