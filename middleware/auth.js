import httpStatus from 'http-status';
import { MESSAGES } from "../utils/messages";

import logger from '../config/loggerconfig';


export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    logger.info(`User Token - ${token} `);
    if (!token) {
      res.status(httpStatus.BAD_REQUEST)
      return res.send({ success: false, err: MESSAGES.UNAUTHORIZED })
    } else {
      next();
    }
  } catch (err) {
    logger.info(`Invalid request ${err}`);

    res.status(httpStatus.BAD_REQUEST)
    return res.send({ success: false, err: err.messgae })
  }
};