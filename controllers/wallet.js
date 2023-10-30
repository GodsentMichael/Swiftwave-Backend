const Wallet = require('models/Wallet')
const User = require('models/User')
const {WalletSchema} = require("validations/wallet")
const { encrypt } = require("helpers/auth");
// const WalletTransaction = require("models/WalletTransactionSchema")

// THIS WALLET CONTROLLER SHOULD BE TRIGGERED AS SOON AS THE USER IS CREATED
exports.createWallet = async(req, res)=>{
    try {
        const { id } = req.user
        const user = await User.findById(id)
        console.log("USER=>", user)
        const wallet = await Wallet.findOne({ user: user.id })
        console.log("WALLET=>", wallet)


        if(!user) return res.status(400).json({error: "User not found"})
        if(wallet) return res.status(400).json({error: "Wallet already exists"})

        const createdWallet = await Wallet.create({
            user: user.id,
        })
        res.status(200).json({ message: "Wallet Created", createdWallet})
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}