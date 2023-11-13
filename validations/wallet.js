const z = require('zod')

const WalletSchema = z.object({
    pin: z.string().min(4).max(4)
}).strict()

const WalletTransactionSchema = z.object({
    amount: z.number().positive(),
    transactionType: z.enum(["credit", "debit"]),
    narration: z.string().min(5).max(255)
}).strict()

const ChangePinSchema = z.object({
    currentPin: z.string().min(4).max(4),
    newPin: z.string().min(4).max(4),
}).strict()

const ResetPinSchema = z.object({
    // email: z.string().email(),
    // otp: z.string().min(4).max(4),
    // newPin: z.string().min(4).max(4),
}).strict()

const VerifyOtpPinSchema = z.object({
    otp: z.string().min(4).max(4)
}).strict()

const SetPinSchema = z.object({
    newPin: z.string().min(4).max(4),
    confirmNewPin: z.string().min(4).max(4)
}).strict()

const FundWalletSchema = z.object({
    amount: z.string()
}).strict()


module.exports = {
    WalletSchema, FundWalletSchema, WalletTransactionSchema, ResetPinSchema,ChangePinSchema, VerifyOtpPinSchema, SetPinSchema
}