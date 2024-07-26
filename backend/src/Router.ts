import {Elysia} from "elysia";
import {MerchantController, PaymentController} from "./controllers";
import {SessionController} from "./controllers";
import { __init_payment_data, __init_session_data, __init_session_fetch_request_data } from "./models/session_models";

export class Router {
    static merchant = new Elysia()
        .get('/', () => MerchantController.getAllMerchants())
        .get('/:uid', ({params: {uid}}) => MerchantController.getMerchantByUID(uid))
    static session = new Elysia()
        // create session from dummy 
        .post('/', ({body: init_session_data}: {body: __init_session_data}) => SessionController.create(init_session_data))
        .get('/verify', ({query: init_session_fetch_request_data}: {query: __init_session_fetch_request_data}) => SessionController.verify(init_session_fetch_request_data))
    static payment = new Elysia()
        .post('/init', ({body: init_payment_data}: {body: __init_payment_data}) => PaymentController.init(init_payment_data))
        .post('/paid', ({body}: {body: any}) => PaymentController.paid(body))
}