import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const viewsSchema = new Schema({
    day: String,
    week: String,
    month: String,
    year: String,
    date: String,
    viewerIp: String,
}, {timestamps: true});
module.exports = mongoose.model('Views', viewsSchema);