import mongoose from "mongoose";


const schema = mongoose.schema({
    id: mongoose.Schema.Types.ObjectId,
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    }
})

export default mongoose.model("Orders", schema);