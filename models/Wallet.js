const mongoose = require('mongoose')
const {Schema, model} = mongoose

const WalletSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    pin: {
        type: String, // Use string, so it can be hashed and saved to db.
    },
    isPinSet: {
        type: Boolean,
        default: false
    },
    mainBalance: {
        type: Number,
        default: 0,
    },
    availableBalance: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
});

module.exports = model("Wallet", WalletSchema);