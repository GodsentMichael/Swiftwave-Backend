const Wallet = require('models/Wallet')
const User = require('models/User')
const {walletSchema} = require("validations/wallet")
const { encrypt } = require("helpers/auth");
const WalletTransaction = require("models/WalletTransactionSchema")

const createWallet = async (req, res) =>{
    try {
        const {id} = req.user
    } catch (error) {
        
    }
}