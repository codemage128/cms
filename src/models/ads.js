import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const adsSchema = new Schema({
    fileName: String,
    fileType: String,
    fileSize: Number,
    url: String,
    adCode: String,
    location: String
}, {timestamps: true});

module.exports = mongoose.model('Ads', adsSchema);