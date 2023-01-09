const apiKey = process.env.MAIL_GUN_API_KEY;
const domain = process.env.MAIL_GUN_DOMAIN;

const mailgun = require('mailgun-js')({ domain, apiKey });

export const sendEmail = (email, body, subject) => {
  mailgun.messages().send({
    from: `test@${domain}`,
      to: email,
      subject,
      html: body
  }).
  then(res => console.log('res---', res)).
  catch(err => console.err('err-', err));
}


export const sendEmailOtp = async (email, otp, name) => {
  const subject = `Confirmation for your Admissionpedia Account`
  const body = `
    <p>Hi ${name},<p>
    <p> <b>${otp}</b> is the confirmation pin for your account, This is only valid for next 5 minutes </p>
    <p>Cheers!</p>
  `

  await sendEmail(email, body, subject);
}
