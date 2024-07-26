import {Console} from "../../helpers/Console";
import { v4 as uuidv4 } from 'uuid';
import { Pool } from "../../Pool";
import { __init_session_data, __init_session_fetch_request_data } from "../../models/session_models";
import { Currency, Status } from "@prisma/client";
import { _findCard } from "../Payment/_findCard";
import { _createPayment } from "../Payment/_createPayment";

export class SessionController {
    ///** ---- create session from merchant's public page, then return url with payment ---- **///
    static async create(init_session_data: __init_session_data){
        try {
            const merchant = await Pool.X.merchant.findUnique({where: {uid: init_session_data.merchant_uid} })
            if (merchant) {
                if (merchant.secret_key == init_session_data.secret_key){
                    const session = await Pool.X.session.create({
                        data: {
                            uid: uuidv4(),
                            merchant_id: merchant.id,
                            secret_key: merchant.secret_key,
                            amount: init_session_data.amount,
                            currency: Currency[init_session_data.currency],
                            description: init_session_data.description,
                            metadata: init_session_data.metadata,
                            created_at: Date.now().toString(),
                            status: Status["PROCESS"],
                            paid: false,
                            stage: 0
                        }
                    })
                    if (session){
                         ///** ---- session successfully created ---- **///
                            Console.log('cyan', '[+] Session created: '+"suid: "+session.uid+" muid: "+merchant.uid,)
                            Console.log('blue', `[->] Expecting at: http://localhost:3000/payment?merchant_uid=${merchant.uid}&session_uid=${session.uid}`)
                            return {"status_code": 200, data: {
                                "session_uid": session.uid,
                                "merchant_uid": merchant.uid,
                                "status": "PROCESS",
                                "currency" : session.currency,
                                "paid": false,
                                "amount": session.amount,
                                "created_at": session.created_at,
                                "description": session.description,
                                "metadata": session.metadata
                            }}
                    } else {
                        ///** ---- session is not created ---- **///
                        Console.log('yellow', '[!] Session is not created')
                        return {"status_code": 400, "message": "[!] Session is not created"}
                    }
                }else {
                    ///** ---- wrong secret key ---- **///
                    Console.log('yellow', '[!] Wrong merchant data')
                    return {"status_code": 400, "message": "[!] Wrong merchant data"}
                }
            } else {
                ///** ---- merchant not found  ---- **///
                Console.log('yellow', '[!] Merchant not found')
                return {"status_code": 400, "message": "[!] Merchant not found"}
            }
        } catch (e){
            ///** ---- some unexpexted error  ---- **///
            Console.log('yellow','[!] Some unexpected error: '+e.toString())
            return {"status_code": 500, "message": 'Some unexpected error: ' + e.toString()}
        }
    }
    // 'sub'scribe event 
    ///** ---- verify session ---- **///

    // check timestamp -> if first init without some of exited -> create status??
    // setup timestamp end and send timer if pending
    static async verify(init_session_fetch_request_data: __init_session_fetch_request_data) {
        try{
            const merchant = await Pool.X.merchant.findUnique({where: {uid: init_session_fetch_request_data.merchant_uid} })
            if (merchant){
                const session = await Pool.X.session.findUnique({where: {uid: init_session_fetch_request_data.session_uid} })
                if (session) {
                    // create initial payment

                    // расставить ошибки
                    const payment = await Pool.X.payment.findUnique({where: {session_uid: session.uid} })
                    if (payment){
                        if (session.status === "PENDING"){
                            Console.log('green', '[!] PENDING')
                            // if timestamp is out of 14 mins
                            if (Date.now() >= Number(payment.created_at) + 840000) { //14 mins
                                await Pool.X.payment.update({
                                    where: {session_uid: session.uid},
                                    data: {time_closed: Date.now().toString(),}
                                }) 
                                await Pool.X.session.update({
                                    where: {uid: session.uid},
                                    data: {status: "EXITED", paid: false}
                                }) 
                                Console.log('green', '[!] EXITED')
                                return { session: {status: "EXITED"}}
                            } else {
                                const card = await Pool.X.card.findUnique({where: {id: payment.card_id} }) 
                                if (card) {
                                    return {
                                        session: {
                                            status: session.status,
                                            currency: session.currency,
                                            amount: session.amount,
                                            timeout: Number(payment.created_at) + 840000 - Date.now()
                                        },
                                        payment: {
                                            payment_type: payment.payment_type,
                                            card_details: {
                                                card_reciever: card.card_receiver,
                                                card_number: card.card_number
                                            }
                                        },
                                        domain: merchant.domain
                                    }
                                }
                            }
                        } 
                        else if (session.status === "SUCCESS") {
                            const card = await Pool.X.card.findUnique({where: {id: payment.card_id} }) 
                            if (card) {
                                Console.log('green', '[!] SUCCESS')
                                return {
                                    session: {
                                        status: session.status,
                                        currency: session.currency,
                                        amount: session.amount,
                                    },
                                    payment: {
                                        payment_type: payment.payment_type,
                                        card_details: {
                                            card_reciever: card.card_receiver,
                                            card_number: card.card_number
                                        }
                                    },
                                    domain: merchant.domain
                                }
                            }
                        }
                        else if (session.status === "EXITED") {
                            Console.log('green', '[!] EXITED')
                            return {session: {status: "EXITED"}}
                        }
                        else if (session.status === "ERROR") {
                            Console.log('green', '[!] ERROR')
                            return {session: {status: "ERROR"}}
                        } 
                    } else {
                        // only process
                        if (session.status === "PROCESS") {
                            ///** ---- 'Оплата еще не инициализирована'  ---- **///
                            Console.log('green', '[!] PROCESS')
                            return {
                                session: {
                                    // payment_type: 
                                    status: session.status,
                                    currency: session.currency,
                                    amount: session.amount,
                                },
                                domain: merchant.domain
                            }
                        }
                    }    
                } else {
                    ///** ---- session not found  ---- **///
                    Console.log('yellow', '[!] Session not found')
                    return {"status_code": 400, "message": "[!] Session not found"}
                }
            } else {
                ///** ---- Merchant not found  ---- **///
                Console.log('yellow', '[!] Merchant not found')
                return {"status_code": 400, "message": "[!] Merchant not found"}     
            }
        } catch (e){
            ///** ---- some unexpexted error  ---- **///
            Console.log('yellow','[!] Some unexpected error: '+e.toString())
            return {"status_code": 500, "message": 'Some unexpected error: '+e.toString()}
        }
    }
}
