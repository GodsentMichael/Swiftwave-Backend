const z = require("zod");

const UserSchema = z
  .object({
    userName: z
      .string({
        required_error: "username is required",
      })
      .min(2, "username is too short"),
    fullName: z
      .string({
        required_error: "fullname is required",
      })
      .min(2, "fullname is too short"),
    howDidYouHear: z
      .enum([
        "Television",
        "Twitter",
        "Instagram",
        "Youtube",
        "LinkedIn",
        "Friends",
      ])
      .optional(),
    email: z
      .string({
        required_error: "email is required",
      })
      .email("Invalid email"),
    gender: z.enum(["Male", "Female"]),
    placeOfBirth: z.object({
      state: z.string({ required_error: "State of birth is required" }),
      localGovtArea: z.string({ required_error: "Local government area of birth is required" }),
    }).optional(),
    phoneNumber: z
      .string({
        required_error: "phone number is required",
      })
      .min(10),
    country: z.string({ required_error: "Country is required" }),
    password: z.string().min(8, "Password is too short"),
  })
  .strict();


const VerifyUserSchema = z
  .object({
    email: z
      .string({
        required_error: "email address is required",
      })
      .email("invalid email address"),
    otp: z
      .string({
        required_error: "otp is required",
      })
      .min(4, "otp must be 4 characters long")
      .max(4, "otp can only be 4 characters long"),
  })
  .strict();

const LoginUserSchema = z.object({
    email: z.string({
      required_error: "Email is required",
    }).email("Invalid email"),
    password: z.string({
      required_error: "Password is required",
    }),
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
    repeatPassword: z.string().min(4, "Password is too short"),
    newPassword: z.string().min(4, "Password is too short"),
    email: z.string().email(),
  })
  .strict();

const UpdatePasswordSchema = z
  .object({
    oldPassword: z.string().min(4, "Password is too short"),
    newPassword: z.string().min(4, "Password is too short"),
    email: z.string().email(),
  })
  .strict()
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "New password can not be the same as old password",
    path: ["newPassword"],
  });

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(4, "Password is too short"),
    newPassword: z.string().min(4, "Password is too short"),
    repeatNewPassword: z.string().min(4, "Password is too short"),
  })
  .strict();

const UpdateEmail = z
  .object({
    otp: z.string().optional(),
    email: z.string().email(),
    newEmail: z.string().email(),
    password: z.string().min(4, "Password is too short"),
  })
  .strict();

const UpdateEmailUpdated = z
  .object({
    email: z.string().email(),
    password: z.string(),
    newMail: z.string().email(),
  })
  .strict();

const UpdateUserProfile = z.object({
  userName: z.string().min(2, "username is too short"),
  // fullName: z.string().min(2, "fullname is too short"),
  // email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(10),
});

module.exports = {
  UserSchema,
  VerifyUserSchema,
  LoginUserSchema,
  VerifyPasswordOtpSchema,
  UpdatePasswordSchema,
  ChangePasswordSchema,
  UpdateEmail,
  ResetPasswordSchema,
  UpdateEmailUpdated,
  UpdateUserProfile,
};
