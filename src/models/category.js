import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: String,
    slug: String,
    description: String,
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    background: String,
    color: {
        type: String,
        default: '#000000'
    }
}, {timestamps: true});

module.exports = mongoose.model('Category', categorySchema);