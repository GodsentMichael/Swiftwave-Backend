const z = require("zod");

const ElectricityBillPaymentSchema = z.object({
    phoneNumber: z.string().min(10),
    amount: z.number().min(50),
    meterNumber: z.string().regex(/^\d+$/).min(10).max(15),
    billingServiceID: z.string().min(1),
    type: z.string().min(1),
}).strict()
const ElectricityVerificationSchema = z.object({
    meterNumber: z.string().regex(/^\d+$/).min(10).max(15),
    billingServiceID: z.string().min(1),
    type: z.string().min(1),
}).strict()

module.exports = {ElectricityBillPaymentSchema,ElectricityVerificationSchema}
