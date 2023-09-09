const mongoose = require('mongoose')
const {Schema, model} = mongoose

const AirtimeSchema = new Schema({
    phoneNumber: {
        type: Number,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    network: {
        type: String,
        required: true,
        trim: true
    },
    selectedPlan: {
        type: String,
      enum:  ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"]
    },
    status: {
        type: String,
        default: 'pending'
    },
    transactionId:{
        type: String,
    }
    
},
{
    timestamps: true,
  }

)

module.exports = model('Airtime', AirtimeSchema)