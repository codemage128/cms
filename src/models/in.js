import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const inSchema = new Schema({
    yes: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

export default mongoose.model('In', inSchema);