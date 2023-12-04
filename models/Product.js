import mongoose from 'mongoose'

const schema = mongoose.Schema({
    id: mongoose.Types.ObjectId,
    name: { type: String, required: true },
    price:{ type: Number, required: true },
});

export default mongoose.model('Product', schema);
