const z = require("zod");

const AirtimeSchema = z.object({
    phoneNumber: z.string().min(10),
    amount: z.number().min(50),
    network: z.string().min(3),
}).strict()

module.exports = {AirtimeSchema}
