import axios from "axios";
import { Pool } from "../../Pool";
import { Console } from "../../helpers/Console";
import { __init_payment_data } from "../../models/session_models";
import {_createPayment} from "./_createPayment";
import {_findCard} from "./_findCard";
import {_setCandidateBusy} from "./_setCandidateBusy";
import http from "http"

export class PaymentController {
    ///** ---- create empty payment & waiting free card ---- **///
    static async init(init_payment_data: __init_payment_data){
        try{
            const session = await Pool.X.session.findUnique({
                where: {uid: init_payment_data.session_uid}
            }) 
            if (session) {
                await Pool.X.session.update({
                    where: {uid: init_payment_data.session_uid},
                    data: {status: "PENDING"}
                }) 
                const card = await _findCard(init_payment_data.payment_type)
                if (card && card.id){
                    console.log(card); 
                    // await _setCandidateBusy({card_id: card.id})
                    const payment = await _createPayment(init_payment_data, card.id)
                    console.log(payment)
                    // send to check api 
                    http.get(process.env.DRIVER + '/expect' +
                        "?login="+card.card_login + 
                        "&password="+card.card_password+
                        "&card_phone="+card.card_phone +
                        "&payment_type=" +card.payment_type +
                        "&timestamp=" + payment.created_at +
                        "&amount=" + session.amount + 
                        "&session_uid=" + session.uid
                    )
                    
                    return {card_details: {
                        card_number: card.card_number,
                        card_receiver: card.card_receiver
                    }}
                    // timestamp end
                } else {
                //** ---- candidate not found.... ---- **///
                //////////////////////////////////////////// TODO: need to wait into _findCard
                }
            }else {
                ///** ---- session not found  ---- **///
                Console.log('yellow','[!] Session not found')
                return {"status_code": 400, "message": "Session not found"}
            }

        } catch (e){
            ///** ---- some unexpeсted error  ---- **///
            Console.log('yellow','[!] Some unexpected error: ' + e.toString())
            return {"status_code": 500, "message": 'Some unexpected error: ' + e.toString()}
        }
    }
    ///** ---- get card login & pwd & number and wait payment---- **///
    static async expect(session_uid: string) {
        try{
            //    todo: redo to unique and dont doubling payments, работает со второго запроса 
            const payment = await Pool.X.payment.findUnique({where:{session_uid}})
            const session = await Pool.X.session.findUnique({where:{uid: session_uid}})
            if (payment && session){
                const card = await Pool.X.card.findUnique({where:{id: payment.card_id}})
                if (card) {    
                    const {data: transaction} = await axios.get(process.env.DRIVER + '/expect', {
                        params: {
                            "login": card.card_login,
                            "password": card.card_password,
                            "card_phone": card.card_phone,
                            "payment_type": card.payment_type,
                            "timestamp": payment.created_at,
                            "amount": session.amount
                        }
                    })

                    if (transaction.status === "SUCCESS"){  
                        await Pool.X.payment.update({
                            where: {session_uid},
                            data: {
                                time_closed: Date.now().toString(),
                                time_paid: transaction.data.time_paid,
                                from: transaction.data.from
                            }
                        })
                        await Pool.X.session.update({
                            where: {uid: session_uid},
                            data: {
                                paid: true,
                                status: "SUCCESS"
                            }
                        })
                        Console.log('green','[+] paid successfully')
                        return {"status_code": 201, "message": "Paid successfully"}
                    } else{
                        Console.log('yellow','[~] not paid yet')
                        return {"status_code": 202, "message": "Not paid yet"}
                    }
                } else {
                    ///** ---- card not found  ---- **///
                    Console.log('yellow','[!] card not found')
                    return {"status_code": 400, "message": 'card not found'}
                }
            } else{
                ///** ---- payment not found  ---- **///
                Console.log('yellow','[!] payment not found')
                return {"status_code": 400, "message": 'payment not found'}
            }
         
        } catch(e){
            ///** ---- some unexpexted error  ---- **///
            Console.log('yellow','[!] Some unexpected error: ' + e.toString())
            return {"status_code": 500, "message": 'Some unexpected error: ' + e.toString()}
        }
    }
}