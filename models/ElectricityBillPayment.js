const mongoose = require('mongoose')

const ElectricityBillPaymentSchema = new mongoose.Schema(
    {
        phoneNumber: {
            type: String,
            required: true,
            trim: true
        },
        amount: {
            type: Number,
            required: true,
            trim: true
        },
        meterNumber: { //billersCode
            type: String,
            required: true,
            trim: true
        },
        billingServiceID: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            default: 'pending'
        },
        transactionId:{
            type: String,
        }

    },
)

module.exports = mongoose.model("ElectricityBillPayment",ElectricityBillPaymentSchema)