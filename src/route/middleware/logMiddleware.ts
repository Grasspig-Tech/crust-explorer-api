import logger from "../../util/logger"
import { Response, Request, NextFunction } from "express"

export function beforeRoute(req: Request, res: Response, next: NextFunction) {
    // debugger;
    console.log(req.originalUrl)
    next();
}


