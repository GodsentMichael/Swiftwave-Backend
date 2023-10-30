const z = require('zod')

const walletSchema = z.object({
    pin: z.string().min(4).max(4)
}).strict()

module.exports = {
    walletSchema
}