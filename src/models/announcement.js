import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const announcementSchema = new Schema({
    title: String,
    body: String,
    type: {
        type: String,
        enum: ['success', 'warning', 'danger']
    },
    active: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});
module.exports = mongoose.model('Announcement', announcementSchema);