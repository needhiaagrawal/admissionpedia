import httpStatus from 'http-status';
import logger from '../../config/loggerconfig';
import { 
    createUserService,
    checkDuplicateEmail,
    checkDuplicateMobile,
    forgetPasswordService,
    isUserExists,
    checkOldPassword,
    isUserExistsByEmail,
    isUserEmailVerified,
    findUserByEmail,
    isUserPhoneVerified,
    sendOtpOnEmail,
    sendOtpOnMobile,
    findUserByPhone,
    isEmailOtpCorrect,
    isEmailOtpExpired,
    validateEmailOtp,
    isUserPhoneOtpExpired,
    isMobileOtpCorrect,
    validateMobileOtp,
    loginService,
    getUserByUsername,
    resetPasswordService,
    isPasswordOtpCorrect,
    isPasswordResetCodeExpired,
    schoolLoginService
} from '../service/user';


export const checkUserNameType = (userName) => {
    const isUserNameNumber = parseInt(userName);

    if(Number.isNaN(isUserNameNumber)) {
        return 'email'
    } else {
        return 'mobile'
    }
}

export const createUser = async (req, res) => {
    try {
        const { name, mobile, email, role, password } = req.body;

        const isEmailDuplicate = await checkDuplicateEmail(email);

        if (isEmailDuplicate) {
            res.status(httpStatus.BAD_REQUEST).send('Email is already registered');
            return;
        }

        const isMobileDuplicate = await checkDuplicateMobile(mobile);

        if (isMobileDuplicate) {
            res.status(httpStatus.BAD_REQUEST).send('Mobile Number is already registered');
            return;
        }

        const userResponse = await createUserService(name, password, email, mobile, role);
        res.status(httpStatus.OK).send(userResponse);

    } catch (err) {
        console.log('Error: ', + err)
        res.status(httpStatus.BAD_REQUEST).send('something went wrong')
    }
}

export const forgetPassword = async (req, res) => {
    try {
        const { userName } = req.body;

        const userNameType = checkUserNameType(userName);

        if (userNameType === 'email') {
            const userExists = await isUserExistsByEmail(userName);

            if (!userExists) {
                res.status(httpStatus.BAD_REQUEST).send('User not found');
                return;
            }
        } if (userNameType === 'mobile') {
            const userExists = await findUserByPhone(userName);

            if (!userExists) {
                res.status(httpStatus.BAD_REQUEST).send('User not found');
                return;
            }
        }

        const user = await forgetPasswordService(userName, userNameType);

        if (!user) {
            res.status(httpStatus.BAD_REQUEST).send('Something went wrong');
            return;
        }

        res.status(httpStatus.BAD_REQUEST).send('Reset code is shared on email and phone');
        return;
       
    } catch (err) {
        console.log('Error: ', + err)
        res.status(httpStatus.BAD_REQUEST).send('something went wrong')
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { userName, otp, password } = req.body;

        const userNameType = checkUserNameType(userName);


        const userExists = await getUserByUsername(userName, userNameType);
        if (!userExists) {
            res.status(httpStatus.BAD_REQUEST).send('User not found');
            return;
        }

        const userData = userExists;

        const isOtpCorrect  = await isPasswordOtpCorrect(userData.id, otp);
        if (!isOtpCorrect) {
            res.status(httpStatus.BAD_REQUEST).send('Invalid Otp');
            return;
        }

        const isOtpExpired = await isPasswordResetCodeExpired(userData.id);
        if (isOtpExpired) {
            res.status(httpStatus.BAD_REQUEST).send('Otp Expired, Please request a new one');
            return;
        }        

        const matchOldPassword = await checkOldPassword(password, userData.id);
        console.log('match Old Password', matchOldPassword);
        if (matchOldPassword) {
            res.status(httpStatus.BAD_REQUEST).send('New password should not be same as old password');
            return; 
        }

        const userResponse = await resetPasswordService(password, userData.id, otp);

        res.status(httpStatus.OK).send(userResponse);

    } catch (err) {
        console.log('Error: ', + err)
        res.status(httpStatus.BAD_REQUEST).send('something went wrong')
    }
}

export const otpResend = async (req, res) => {
    try {
        const { email, source, mobile } = req.query;

        if (source === 'email') {
            const user = await findUserByEmail(email);
            if (!user) {
                res.status(httpStatus.BAD_REQUEST).send('User not found');
                return;
            }

            const isEmailVerified = await isUserEmailVerified(email);
            if (isEmailVerified) {
                res.status(httpStatus.BAD_REQUEST).send('Email is already verified');
                return;
            }

            await sendOtpOnEmail(user.id, email, user.name);
        } else if (source === 'phone') {

            if (!mobile) {
                res.status(httpStatus.BAD_REQUEST).send('mobile is required');
                return;
            }

            const user = await findUserByPhone(mobile);
            if (!user) {
                res.status(httpStatus.BAD_REQUEST).send('User not found');
                return;
            }

            const isPhoneVerified = await isUserPhoneVerified(mobile);
            if (isPhoneVerified) {
                res.status(httpStatus.BAD_REQUEST).send('Phone is already verified');
                return;
            }

            await sendOtpOnMobile(user.id, mobile);
        } else {
            res.status(httpStatus.BAD_REQUEST).send('Invalid Source');
            return;
        }

        res.status(httpStatus.OK).send("success");

    } catch (err) {
        console.log('Error: ', + err)
        res.status(httpStatus.BAD_REQUEST).send('something went wrong')
    }
}

export const otpValidate = async (req, res) => {

    try {
        const { email, source, mobile, otp } = req.query;

        if (source === 'email') {

            if (!email) {
                res.status(httpStatus.BAD_REQUEST).send('Email is required');
                return;
            }

            const user = await findUserByEmail(email);
            console.log(">>>> User", user);
            if (!user) {
                res.status(httpStatus.BAD_REQUEST).send('User not found');
                return;
            }

            const isEmailVerified = await isUserEmailVerified(email);
            if (isEmailVerified) {
                res.status(httpStatus.BAD_REQUEST).send('Email is already verified');
                return;
            }

            const isOtpCorrect  = await isEmailOtpCorrect(email, otp);
            if (!isOtpCorrect) {
                res.status(httpStatus.BAD_REQUEST).send('Invalid Otp');
                return;
            }

            const isOtpExpired = await isEmailOtpExpired(email);
            if (!isOtpExpired) {
                res.status(httpStatus.BAD_REQUEST).send('Otp Expired, Please request a new one');
                return;
            }

            const validateOtpRes = await validateEmailOtp(email);

            res.status(httpStatus.OK).send('Email Verified');
            return;

        } else if (source === 'phone') {
            if (!mobile) {
                res.status(httpStatus.BAD_REQUEST).send('mobile is required');
                return;
            }

            const user = await findUserByPhone(mobile);
            if (!user) {
                res.status(httpStatus.BAD_REQUEST).send('User not found');
                return;
            }

            const isPhoneVerified = await isUserPhoneVerified(mobile);
            if (isPhoneVerified) {
                res.status(httpStatus.BAD_REQUEST).send('Phone is already verified');
                return;
            }

            const isOtpCorrect = await isMobileOtpCorrect(mobile, otp); 
            if (!isOtpCorrect) {
                res.status(httpStatus.BAD_REQUEST).send('Otp is Invalid');
                return;
            }

            const isPhoneOtpExpired = await isUserPhoneOtpExpired(mobile);
            if (isPhoneOtpExpired) {
                res.status(httpStatus.BAD_REQUEST).send('Phone otp is expired');
                return;
            }

            
            const validateOtpRes = await validateMobileOtp(mobile);

            res.status(httpStatus.OK).send('Mobile Otp Verified');
            return;

        }
    } catch  (err) {
        console.log('Error: ', + err)
        res.status(httpStatus.BAD_REQUEST).send('something went wrong')
    }

}

export const login = async (req, res) => {
    try {

        const { userName, password } = req.body

        const userNameType = checkUserNameType(userName);
        const userData = await loginService(userName, password, userNameType);

        if(!userData) {
            res.status(httpStatus.BAD_REQUEST).send('Incorrect credentials')
            return userData; 
        } 

        res.status(httpStatus.OK).send(userData)
        return userData; 
    } catch (err) {
        console.log('Error: ', + err)
        logger.info('Error: ', + err)
        res.status(httpStatus.BAD_REQUEST).send('something went wrong')
    }
}

export const schoolLogin = async (req, res) => {
  try {
    const { userName, password } = req.body
    // const userNameType = checkUserNameType(userName);
    const userData = await schoolLoginService(userName, password)
    if (!userData) {
      res
        .status(httpStatus.BAD_REQUEST)
        .send({ success: false, message: 'Incorrect credentials' })
      return userData
    }
    res.status(httpStatus.OK).send({ success: true, token: userData })
    return userData
  } catch (err) {
    logger.info('Error: ', +err)
    res.status(httpStatus.BAD_REQUEST).send('something went wrong')
  }
}
