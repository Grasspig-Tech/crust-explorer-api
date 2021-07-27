import express, { Express } from "express"
// import path from "path"
import catchErrorMiddleware from "./middleware/catchErrorMiddleware"
import blockRoute from "./module/block"
// import validatorRoute from "./module/validator"
import { beforeRoute } from "./middleware/logMiddleware"
import networkOverviewRoute from "./module/network_overview"
import accountRoute from "./module/account"
import eraRoute from "./module/era"
export default (app: Express) => {
    app.use(beforeRoute)
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json({ limit: '50mb' }));
    // app.use()
    app.use("/api/block", blockRoute);
    app.use("/api/era", eraRoute);
    app.use("/api/network_overview", networkOverviewRoute);
    app.use("/api/account", accountRoute)

    app.use(catchErrorMiddleware);



}