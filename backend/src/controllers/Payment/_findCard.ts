import {Console} from "../../helpers/Console";
import { Pool } from "../../Pool";
import { PaymentType } from "@prisma/client";

export const _findCard = async (payment_type: PaymentType) => {
    try {
        const candidate = await Pool.X.card.findFirst({
            where: {
                active: true,
                busy: false,
                payment_type: PaymentType[payment_type]
            } 
        })
        if (candidate){
            Console.log('cyan', `[+] Candidate found`)
            return {
                card_login: candidate.card_login.trim(),
                card_password: candidate.card_password.trim(),
                card_number: candidate.card_number.trim(),
                card_receiver: candidate.card_receiver.trim(),
                time_opened: Date.now().toString(),
                card_phone: candidate.card_phone,
                payment_type: candidate.payment_type,
                id: candidate.id
            }
        } else{
            ///** ---- candidate not found.... ---- **///
            // need to wait
        }
    } catch (e) {
        //** ---- some unexpexted error  ---- **///
        Console.log('yellow','[!] Some unexpected error: ' + e.toString())
        return {"status_code": 500, "message": 'Some unexpected error: ' + e.toString()}
    }
}
