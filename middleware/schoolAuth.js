import httpStatus from 'http-status';
import { MESSAGES } from "../utils/messages";
import logger from '../config/loggerconfig';
import { getDecodedToken } from "../utils/user";
import { getSchoolUser } from '../app/Service/user';

export const schoolAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    logger.info(`School User Token - ${token} `);
    if (!token) {
      res.status(httpStatus.BAD_REQUEST)
      return res.send({ success: false, err: MESSAGES.UNAUTHORIZED })
    } else {
      let userFromToken = getDecodedToken(token);
      if(userFromToken.userId && userFromToken.role == "school-admin"){
        let user = await getSchoolUser(userFromToken.userId);
        if(user){
          next();
        }else{
          return res.status(httpStatus.BAD_REQUEST).send({ success: false, err: MESSAGES.INVALID_TOKEN })
        }
      }else{
        return res.status(httpStatus.BAD_REQUEST).send({ success: false, err: MESSAGES.INVALID_TOKEN })
      }
    }
  } catch (err) {
    logger.info(`Invalid request ${err}`);
    res.status(httpStatus.BAD_REQUEST)
    return res.send({ success: false, err: err.message })
  }
};