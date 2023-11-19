const z = require('zod')

const ReportIssueSchema = z.object({
    complaintCategory: z.string()
        .min(3, { message: 'Category is too short' })
        .max(50, { message: 'Category is too long' })
        .refine((data) => {
            return ['Bills Payment', 'Account Top-up', 'Transaction Pin', 'Account Verification', 'Others'].includes(data)
        }, { message: 'Invalid category' }),
    subject: z.string()
        .min(3, { message: 'Subject is too short' })
        .max(50, { message: 'Subject is too long' }),
    email: z.string()
        .email({ message: 'Invalid email' }),
    description: z.string()
        .min(3, { message: 'Description is too short' })
        .max(255, { message: 'Description is too long' }),
    image: z.string().optional()
}).strict()


module.exports = {ReportIssueSchema}