import got from 'axios';
import logger from '../../config/loggerconfig';

export const sendOtpToMobile = async (mobile, otp) => {
	try {
        const message = `The OTP for verification at AdmissionPedia is ${otp}. Schoolsindia`;

        const url = `https://api.textlocal.in/send/?apiKey=${process.env.TEXTLOCAL_API_KEY}&sender=${process.env.TEXTLOCAL_SENDERID}&numbers=91${mobile}&message=${message}`
		const res = await got.get(url);
		logger.info(`res from otp:${res.data.errors}`);
	} catch (err) {
		logger.error(err);
	}
}