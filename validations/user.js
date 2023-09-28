const z = require("zod");

const UserSchema = z.object({
  howDidYouHear: z.enum(["Television", "Twitter", "Instagram", "Youtube", "LinkedIn",  "Friends"],  ).optional(),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(10),
  password: z.string().min(8, "Password is too short"),
})
  .strict();

const VerifyUserSchema = z
  .object({
    email: z.string().email(),
    otp: z.string().min(4).max(4),
  })
  .strict();

const LoginUserSchema = z
  .object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6).max(30),
  })
  .strict();

const VerifyPasswordOtpSchema = z
  .object({
    email: z.string().email(),
    otp: z.string().min(4).max(5),
  })
  .strict();

const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password is too short"),
    token: z.string().min(5),
  })
  .strict();

const UpdatePasswordSchema = z
  .object({
    oldPassword: z.string().min(8, "Password is too short"),
    newPassword: z.string().min(8, "Password is too short"),
    email: z.string().email(),
  })
  .strict()
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "New password can not be the same as old password",
    path: ["newPassword"],
  });

const UpdateEmail = z
  .object({
    otp: z.string().optional(),
    email: z.string().email(),
    newEmail: z.string().email(),
    password: z.string().min(4, "Password is too short"),
  })
  .strict();

  const UpdateEmailUpdated = z.object({
    email: z.string().email(),
    password: z.string(),
    newMail: z.string().email()
  }).strict()

module.exports = {
  UserSchema,
  VerifyUserSchema,
  LoginUserSchema,
  VerifyPasswordOtpSchema,
  UpdatePasswordSchema,
  UpdateEmail,
  ResetPasswordSchema,
  UpdateEmailUpdated
};
