const z = require('zod')

const WalletSchema = z.object({
    pin: z.string().min(4).max(4)
}).strict()

const WalletTransactionSchema = z.object({
    amount: z.number().positive(),
    transactionType: z.enum(["credit", "debit"]),
    narration: z.string().min(5).max(255)
}).strict()

const FundWalletSchema = z.object({
    amount: z.string()
}).strict()


module.exports = {
    WalletSchema, FundWalletSchema, WalletTransactionSchema
}