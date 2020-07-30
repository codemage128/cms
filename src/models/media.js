import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const mediaSchema = new Schema({
    file_name: String,
    file_type: String,
    file_size: Number,
    file_extension: String,
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

module.exports = mongoose.model('Media', mediaSchema);