import {Console} from "../../helpers/Console";

export const _setCandidateBusy = async ({card_id} : {card_id: number}) => {
    try {
        // await Database.sql(`
        //     UPDATE whaletable.cards
        //     SET busy=true
        //     WHERE id = ${card_id};`
        // )
        Console.log('cyan', `[PSQL]: set busy card: ${card_id}`)
    } catch (e){
        Console.log('red', '[PSQL]: error setting card busy: '+e.toString())
    }
}