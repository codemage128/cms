import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    fullname: String,
    email: String,
    number: Number,
    help: String,
    message: String
}, {timestamps: true});

module.exports = mongoose.model('Contact', contactSchema);