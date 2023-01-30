import User from "../models/user"
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../helper/constant";
import stackOtp from 'stack-otp';
import moment from 'moment';
import { sendEmailOtp } from "../helper/sendEmail";
import { generateToken } from "../../utils/user";
import { sendOtpToMobile } from "../helper/sendOtp";
import SchoolUser from "../models/schoolUsers";
import { getDecodedToken } from "../../utils/user";
import { MESSAGES } from "../../utils/messages";
export const generateOtp = async () => {
    return stackOtp.numericOtp(6);
}

export const sendOtpOnEmail = async (userId, email, name) => {
    const emailOtp = await generateOtp();

    // calculating expiry time

    let expiryTime = moment().add(5, 'minutes').toISOString()
    expiryTime = moment(expiryTime).toISOString()
    const user = await User.update({ email_expiry_time: expiryTime, email_verification_code: emailOtp }, { where: { id: userId } });

    sendEmailOtp(email, emailOtp, name)
    // send otp Code will come here 

}

export const sendOtpOnMobile = async (userId, mobile) => {
    const mobileOtp = await generateOtp();

    // calculating expiry time
    let expiryTime = moment().add(5, 'minutes').toISOString()
    expiryTime = moment(expiryTime).toISOString();
    const user = await User.update({ mobile_expiry_time: expiryTime, mobile_verification_code: mobileOtp }, { where: { id: userId } });
    // send otp code will come here
    sendOtpToMobile(mobile, mobileOtp);
}

export const createUserService = async (name, password, email, mobile, role) => {

    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    const encryptedPassword = bcrypt.hashSync(password, salt)

    const newUser = await User.create({
        name,
        password: encryptedPassword,
        email,
        mobile,
        email_verified: false,
        mobile_verified: false,
        role
    });

    const userId = newUser.toJSON().id;
    await sendOtpOnEmail(userId, email, name);
    await sendOtpOnMobile(userId, mobile);

    return newUser;
}

export const checkDuplicateEmail = async (email) => {
    const user = await User.findOne({ where: { email: email } });
    return user ? true : false
}

export const checkDuplicateMobile = async (mobile) => {
    const user = await User.findOne({ where: { mobile: mobile } });
    return user ? true : false
}

export const forgetPasswordService = async (userName, userNameType) => {
    const passwordResetCode = await generateOtp();
    let expiryTime = moment().add(5, 'minutes').toISOString()
    expiryTime = moment(expiryTime).toISOString();

    await User.update({ password_reset_code: passwordResetCode, password_expiry_time: expiryTime }, { where: { [userNameType]: userName } });
    const user = await User.findOne({ where: { [userNameType]: userName } });


    if (!user) return;

    const userData = user?.toJSON();
    if (!userData) return;

    sendEmailOtp(userData.email, passwordResetCode, userData.name);
    // send otp on mobile will come here 

    return userData;
}

export const checkOldPassword = async (newPassword, userId) => {
    const user = await User.findOne({ where: { id: userId } });

    let result = false
    if (user) {
        const userData = user.toJSON();
        const isPasswordCorrect = bcrypt.compareSync(newPassword, userData.password);
        if (isPasswordCorrect) {
            result = true
        }
    }
    return result;
}

export const resetPasswordService = async (newPassword, userId, otp) => {
    try {

        const salt = bcrypt.genSaltSync(SALT_ROUNDS);
        const encryptedPassword = bcrypt.hashSync(newPassword, salt);
    
        const user = await User.update({ password: encryptedPassword, password_reset_code: null, password_expiry_time: null }, { where: { id: userId, password_reset_code: otp } });
    
        return user?.[0] ? "Success" : "something went wrong";
    } catch (err) { "something went wrong";
        console.log('Error in reset Service', err)
        return "something went wrong";
    }
}

export const changePasswordService = async (token, oldPassword, newPassword) => {
    const userDetial = await getDecodedToken(token);
    if (userDetial && userDetial.userId) {
        const userId = userDetial.userId;
        const isMatch = await checkOldPassword(oldPassword, userId);
        if (!isMatch) {
            throw Error(MESSAGES.INVALID_PWD);
        } else {
            //update password
            const salt = bcrypt.genSaltSync(SALT_ROUNDS);
            const encryptedPassword = bcrypt.hashSync(newPassword, salt);
            const user = await User.update({ password: encryptedPassword },
                {
                    where: { id: userId }
                });
            if(user){
                return "Password updated successfully.";
            }
            throw Error("something went wrong");
        }
    } else {
        throw Error(MESSAGES.INVALID_TOKEN);
    }
}

export const isUserExists = async (userId) => {
    const user = await User.findOne({ where: { id: userId } });
    return user ? true : false
}



export const isUserExistsByEmail = async (email) => {
    const user = await User.findOne({ where: { email: email } });
    return user ? true : false
}


export const isUserEmailVerified = async (email) => {
    const user = await User.findOne({ where: { email: email } });
    return user?.email_verified ? true : false
}

export const isUserPhoneVerified = async (phone) => {
    const user = await User.findOne({ where: { mobile: phone } });
    return user?.phone_verified ? true : false
}

export const findUserByEmail = async (email) => {
    const user = await User.findOne({ where: { email: email } });
    return user?.toJSON()
}

export const findUserByPhone = async (phone) => {
    const user = await User.findOne({ where: { mobile: phone } });
    return user?.toJSON()
}


export const getUserByUsername = async (userName, userNameType) => {
    const user = await User.findOne({ where: { [userNameType]: userName } });
    return user?.toJSON()
}

export const isEmailOtpCorrect = async (email, otp) => {
    const user = await User.findOne({ where: { email: email, email_verification_code: parseInt(otp) } });
    return user?.toJSON() ? true : false
}

export const isEmailOtpExpired = async (email) => {
    const user = await User.findOne({ attributes: ["email_expiry_time"], where: { email: email } });
    const userData = user?.toJSON()
    let otpExpired = false;
    if (moment().isAfter(moment(userData.email_expiry_time))) {
        otpExpired = true;
    }

    return otpExpired;
}

export const validateEmailOtp = async (email) => {
    const user = await User.update({ email_verification_code: null, email_verified: 1, email_expiry_time: null }, { where: { email: email } });
    return user;
}

export const isUserPhoneOtpExpired = async (mobile) => {
    const user = await User.findOne({ attributed: ["mobile_expiry_time"], where: { mobile: mobile } });
    const userData = user?.toJSON()
    let otpExpired = false;
    if (moment().isAfter(moment(userData.mobile_expiry_time))) {
        otpExpired = true;
    }

    return otpExpired;
}

export const isPasswordResetCodeExpired = async (id) => {
    const user = await User.findOne({ attributed: ["password_expiry_time"], where: { id: id } });
    const userData = user?.toJSON()
    let otpExpired = false;
    if (moment().isAfter(moment(userData.mobile_expiry_time))) {
        otpExpired = true;
    }

    return otpExpired;
}

export const isPasswordOtpCorrect = async (id, otp) => {
    const user = await User.findOne({ where: {  id: id, password_reset_code: parseInt(otp) } });
    return user?.toJSON() ? true : false
}

export const isMobileOtpCorrect = async (mobile, otp) => {
    const user = await User.findOne({ where: { mobile: mobile, mobile_verification_code: parseInt(otp) } });
    return user?.toJSON() ? true : false
}


export const validateMobileOtp = async (mobile) => {
    const user = await User.update({ mobile_verification_code: null, mobile_verified: 1, mobile_expiry_time: null }, { where: { mobile: mobile } });
    return user
}

export const loginService = async (username, password, usernameType) => {

    try {
        const user = await User.findOne({ attributes: ["name", "id", "email", "mobile", "mobile_verified", "email_verified", "password"], where: { [usernameType]: username } });

        if (user) {
            const userData = user.toJSON();
            const isPasswordCorrect = bcrypt.compareSync(password, userData.password);

            if (!isPasswordCorrect) return null;
            else {
                const token = generateToken({
                    username,
                    userId: userData.id,
                    usernameType,
                    email: userData.email,
                    mobile: user.mobile,
                    mobile_verified: user.mobile_verified,
                    email_verified: user.email_verified
                });

                return token
            }
        }
        return null;
    } catch (err) {

        console.log("Error: in finding user", err);
        return null;

    }

}
export const schoolLoginService = async (username, password) => {

    try {
        const user = await SchoolUser.findOne({ attributes: ["name", "id", "email","email_verified", "password","status"], 
        where: { email: username, status: "Onboared" } });
        if (user) {
            const userData = user.toJSON();
            const isPasswordCorrect = bcrypt.compareSync(password, userData.password);

            if (!isPasswordCorrect) return null;
            else {
                const token = generateToken({
                    username,
                    userId: userData.id,
                    email: userData.email,
                    mobile: user.mobile,
                    mobile_verified: user.mobile_verified,
                    email_verified: user.email_verified,
                    role: "school-admin"
                });

                return token
            }
        }
        return null;
    } catch (err) {

        console.log("Error: in finding user", err);
        return null;

    }

}

export const getSchoolUser = async(userId) => {
    const user = await SchoolUser.findOne({ where: { id: userId } });
    return user ? user : false
}