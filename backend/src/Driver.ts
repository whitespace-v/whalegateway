import dotenv from "dotenv";
import axios from "axios";
import {__payment_types} from "./models/session_models";
dotenv.config();

export class Driver {
    static async auth({card_login, card_password, payment_type}: {card_login: string, card_password: string, payment_type: __payment_types}) {
        const {data} = await axios.get(process.env.DRIVER+__payment_types[payment_type], {params: {card_login, card_password}})
        return data
    }
    static async expectance({cookies, payment_type}: {cookies: any, payment_type: __payment_types}){
        const {data} = await axios.post(process.env.DRIVER+'expectance', {cookies, payment_type: __payment_types[payment_type]})
        return data
    }
}