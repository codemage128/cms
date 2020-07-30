import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const pageSchema = new Schema({
    name: String,
    content: String,
    featuredImage: String,
    status: {
        type: String,
        enum: ['published', 'draft']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    slug: String,
    location: {
        type: String,
        enum: ['top-menu', 'main-menu', 'footer']
    },
    position: {
        type: String,
        enum: ['right', 'left']
    }
}, {timestamps: true});
module.exports = mongoose.model('Pages', pageSchema);