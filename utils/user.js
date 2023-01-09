import jwt from 'jsonwebtoken';


export const generateToken = async (data) => {
    const token = jwt.sign(
        { ...data },
        process.env.TOKEN_KEY
      );

    return token;
}