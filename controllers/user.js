const User = require("models/User");
const {
    UserSchema,
    VerifyUserSchema,
    LoginUserSchema,
    VerifyPasswordOtpSchema,
    UpdatePasswordSchema,
    UpdateEmail,
    ResetPasswordSchema,
} = require("validations/user");

const { encrypt } = require("helpers/auth");
const { compare } = require("helpers/auth");
const {
    generateToken,
    generateRefreshToken,
    decodeToken,
    resetPasswordToken,
} = require("helpers/token");

const { validateUser } = require("services/auth");
const { generateOTP } = require("helpers/token");

const {
    badRequest,
    notFound,
    unAuthorized,
    unAuthenticated,
    formatServerError,
} = require("helpers/error");

const verifyOTP = require("helpers/verifyOtp");
// const { sendMail } = require("services/mail");
const sendEmail = require("services/email");
const { createAccountOtp } = require("helpers/mails/otp");

exports.createUser = async(req, res) => {
    const body = UserSchema.safeParse(req.body);

    if (!body.success) {
        return res.status(400).json({
            errors: body.error.issues,
        });
    }

    const { email, phoneNumber, password, howDidYouHear } = body.data;
    try {
        // check user
        const checkPhone = await User.findOne({ phoneNumber })
        if (checkPhone) {
            return badRequest(res, "Phone Number already taken")
        }

        const checkEmail = await User.findOne({ email })
        if (checkEmail) {
            return badRequest(res, "Email is already taken")
        }


        // hash password & otp

        body.data.password = await encrypt(password);

        const otpValue = generateOTP();

        const otp = await encrypt(otpValue);

        const user = new User({
            ...body.data,
            otp,
            otpExpireIn: new Date().getTime() + 30 * 60 * 1000, // To expire in 30 minutes.
        });
        

        await user.save();

        const data = {
			to: email,
			text: 'Swiftwave OTP Verification',
			subject: 'Kindly Verify Your Account',
			html: createAccountOtp(otpValue),
		};
		await sendEmail(data);

        const refreshToken = generateRefreshToken(user._id);

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: process.env.NODE_ENV === "development" ? false : true,
            maxAge: 240 * 60 * 60 * 1000,
        });

        res.status(201).json({
            msg: "account created",
            // token,
            refreshToken,
        });
    } catch (error) {
        console.log("CREATE USER ERROR", error);
        res.status(500).json({
            errors: [{
                error: "Server Error",
            }, ],
        });
    }
};

exports.verifyUser = async(req, res) => {
    const body = VerifyUserSchema.safeParse(req.body);

    if (!body.success) {
        return res.status(400).json({
            errors: body.error.issues,
        });
    }
    const { email, otp } = body.data;
    try {
        const { error, user } = await validateUser(email, otp);

        console.log("ERROR=>", error);

        if (error) {
            return badRequest(res, error);
        }

        res.status(200).json({
            verified: user.verified,
            msg: "User verified",
        });
    } catch (error) {
        console.log("VERIFY USER ERROR", error);
        res.status(500).json({
            errors: [{
                error: "Server Error",
            }, ],
        });
    }
};

// User Login
exports. userLogin = async(req, res) => {
    const body = LoginUserSchema.safeParse(req.body);
    if (!body.success) {
        return res.status(400).json({
            error: body.error.issues,
        });
    }
    const { email, password } = body.data;
    try {
        const checkUser = await User.findOne({
         email: email,
        });

        if (!checkUser) {
            return badRequest(res, "Incorrect credentials");
        }
        const checkPassword = await compare(password, checkUser.password);
        if (!checkPassword) {
            return badRequest(res, "Incorrect credentials");
        }
        const token = generateToken(checkUser._id, checkUser.email);
        const refreshToken = generateRefreshToken(checkUser._id);

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: process.env.NODE_ENV === "development" ? false : true,
            maxAge: 240 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login Success",
            token,
            refreshToken,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                error: "Server Error",
            }, ],
        });
    }
};