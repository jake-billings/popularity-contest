import "reflect-metadata";
import {createConnection} from "typeorm";
import * as Koa from "koa";
import * as Router from "koa-router";
import * as serve from "koa-static";
import * as bodyParser from "koa-bodyparser";
import {AppRoutes} from "./routes";
import errorFormatterMiddleware from "./error/ErrorFormatter.middleware";

// create connection with database
// note that its not active database connection
// TypeORM creates you connection pull to uses connections from pull on your requests
createConnection().then(async connection => {

    // create koa app
    const app = new Koa();
    const router = new Router();

    // register all application routes
    AppRoutes.forEach(route => router[route.method]('/api'+route.path, route.action));

    // run app
    app.use(bodyParser());
    app.use(errorFormatterMiddleware);
    app.use(router.routes());
    app.use(router.allowedMethods());
    app.use(serve(__dirname + '/frontend'));
    app.listen(3000);

    console.log("Koa application is up and running on port 3000");

}).catch(error => console.log("TypeORM connection error: ", error));