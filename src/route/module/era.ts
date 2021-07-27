


import express, { Response, Request, NextFunction } from "express"
import { getResult } from "../../util/get-result"
import GrantWs from "../../api/grant-ws"
import { ApiPromise } from '@polkadot/api';
import { getEraInfo } from "../../service/era"
const Router = express.Router();

/* 
    通过era获取

*/
Router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    // debugger
    try {
        let api: ApiPromise = GrantWs.getApi(req.originalUrl) as ApiPromise;
        let result = await getEraInfo(api);
        res.send(getResult({ data: result }))
    } catch (error) {
        next(error);
    }

})









export default Router;