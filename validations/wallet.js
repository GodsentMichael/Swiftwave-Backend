const z = require('zod')

const WalletSchema = z.object({
    pin: z.string().min(4).max(4)
}).strict()

module.exports = {
    WalletSchema
}