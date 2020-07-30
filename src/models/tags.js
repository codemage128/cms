import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const tagsSchema = new Schema({
    name: String,
    slug: String,
    description: String
}, {timestamps: true});
module.exports = mongoose.model('Tags', tagsSchema)