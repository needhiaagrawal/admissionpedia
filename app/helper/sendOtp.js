import got from 'axios';

export const sendOtpToMobile = async (mobile, otp) => {
	try {
        const message = `The OTP for verification at AdmissionPedia is ${otp}. Schoolsindia`;

        const url = `https://api.textlocal.in/send/?apiKey=${process.env.TEXTLOCAL_API_KEY}&sender=${process.env.TEXTLOCAL_SENDERID}&numbers=91${mobile}&message=${message}`
        console.log(">>> Text local", url)
		const res = await got.get(url);
		console.log("res from otp", res.data.errors);
	} catch (err) {
		console.log(err);
	}
}