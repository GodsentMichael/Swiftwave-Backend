const z = require("zod");

const DataSchema = z.object({
    phoneNumber: z.string().min(10),
    amount: z.number().min(50),
    selectDataPlan: z.string().min(3),
    network: z.string().min(3),
}).strict()

module.exports = {DataSchema}
