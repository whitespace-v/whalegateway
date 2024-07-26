import {__init_payment_data, __payment_data} from "../../models/session_models";
import {Console} from "../../helpers/Console";
import { Pool } from "../../Pool";
import { PaymentType } from "@prisma/client";


export const _createPayment = async (payment_data: __init_payment_data, card_id: number) => {
    try {
        const session = await Pool.X.session.findUnique({ where: {uid: payment_data.session_uid }})
        if (session){
            const payment = await Pool.X.payment.create({ 
                data: {
                    time_opened: payment_data.time_opened,
                    timezone: payment_data.timezone,
                    browser_version: payment_data.browser_version,
                    browser_language: payment_data.browser_language,
                    ip: payment_data.ip,
                    email: payment_data.email,
                    payment_type: PaymentType[payment_data.payment_type],
                    session_uid: payment_data.session_uid,
                    card_id,
                    created_at: Date.now().toString()
                }
            })
          
            if (payment){
                //** ---- payment is not created  ---- **///
                Console.log('cyan','[+] Payment created')
                return payment
            } else {
                //** ---- payment is not created  ---- **///
                Console.log('yellow','[!] Payment is not inited')
                return {"status_code": 400, "message": 'Payment is not inited'}
            }
            
        } else {
            //** ---- session is not found  ---- **///
            Console.log('yellow','[!] Session is not found')
            return {"status_code": 400, "message": 'Session is not found'}
    
        }
    } catch (e){
        //** ---- some unexpexted error  ---- **///
        Console.log('yellow','[!] Some unexpected error: '+e.toString())
        return {"status_code": 500, "message": 'Some unexpected error: '+e.toString()}
    
    }
}
