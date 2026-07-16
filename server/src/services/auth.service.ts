import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { LoginInput, RegisterInput } from "../schemas/auth.schema.js";
import { generateAccessToken, generateRefreshToken, hashRefreshToken } from "../utils/jwt.js";
import ApiError from "../utils/apiError.js";


const registerService = async (data: RegisterInput) => {

    const existingUser = await User.exists(
        {
            $or: [{ email: data.email }, { username: data.username }]
        }
    )

    if (existingUser) {
        throw new ApiError(409, "User already exists")
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
        ...data,
        password: hashedPassword
    })


    return user;

}


const loginService = async (data: LoginInput) => {
    const user = await User.findOne(
        {
            $or: [{ email: data.identifier }, { username: data.identifier }]
        }
    ).select("+password")

    if (!user) {
        throw new ApiError(400, "Invalid credentials")
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials")
    }

    const payload = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
    }

    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    const hashedRefreshToken = hashRefreshToken(refreshToken)

    user.refreshToken = hashedRefreshToken;
    await user.save({ validateBeforeSave: false });

    return { user, accessToken, refreshToken }

}

export { registerService, loginService }