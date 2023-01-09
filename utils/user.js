import jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';

export const generateToken = async (data) => {
    const token = jwt.sign(
        { ...data },
        process.env.TOKEN_KEY
      );

    return token;
}

export const getDecodedToken = (jwtToken) => {
  if(!jwtToken) {
    return false;
  }

  var decoded = jwt_decode(jwtToken);
  return decoded
}