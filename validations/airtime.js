const z = require("zod");

const AirtimeSchema = z.object({
    // phoneNumber: z.number().min(10),
    phoneNumber: z.string().min(10),
    amount: z.number().min(50),
    selectedPlan: z.enum(["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"]),
    network: z.string().min(3),
}).strict()

module.exports = {AirtimeSchema}
