import dotenv from "dotenv";
import { Elysia  } from 'elysia'
import {Console} from "./helpers/Console";
import {Router} from "./Router";
import { cors } from '@elysiajs/cors'

class API {
    constructor() {
        dotenv.config();
        this.useMiddlewares()
        this.useRoutes()
        this.init().then(async () => {
            Console.log("magenta",`[server]: Server is running at http://localhost:${process.env.BACKEND_PORT}`);
        })
    }
    private app = new Elysia()

    private useMiddlewares(){
        this.app.use(cors())
    }
    private useRoutes(){
        this.app.group('/merchant', app => app.use(Router.merchant))
        this.app.group('/session', app => app.use(Router.session))
        this.app.group('/payment', app => app.use(Router.payment))
    }
    async init(){
        this.app.get('/', () => 'Hello Elysia')
        this.app.listen(process.env.BACKEND_PORT || 5000)
    }
}

new API()

