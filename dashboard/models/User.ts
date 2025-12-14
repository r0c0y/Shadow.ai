
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email for this user.'],
        unique: true,
    },
    name: String,
    image: String,
    integrations: {
        slack: {
            webhookUrl: String,
            enabled: { type: Boolean, default: false },
            notifications: {
                highRisk: { type: Boolean, default: true },
                success: { type: Boolean, default: true }
            }
        },
        emailDigest: {
            enabled: { type: Boolean, default: false },
            frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
            time: { type: String, default: '09:00' }
        }
    },
    apiKeys: {
        gemini: String, // Allow user to override
        openai: String
    },
    monitoredRepos: [{
        repo: String, // "owner/repo"
        branch: { type: String, default: 'main' },
        notifications: {
            slack: { type: Boolean, default: true },
            email: { type: Boolean, default: false }
        },
        lastScanned: Date
    }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
