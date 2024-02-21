    import { Schema, model } from "mongoose";

    const transactionSchema = new Schema({
        id: {
            type: Number,
            unique: true
        },
        title: String,
        price: Number,
        description: String,
        category: String,
        image: String,
        sold: Boolean,
        dateOfSale: Date
    });

    const Transaction = model('transaction', transactionSchema);

    export default Transaction;