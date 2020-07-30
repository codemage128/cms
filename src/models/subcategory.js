import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const subCategorySchema = new Schema({
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    name: String,
    slug: String,
    description: String
}, {timestamps: true});

module.exports = mongoose.model('SubCategory', subCategorySchema);