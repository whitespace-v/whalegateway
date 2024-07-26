import React, { useEffect, useState } from 'react';
import classes from '../styles/Components/PaymentCard.module.scss';
import { __payment_types } from "../core/models";
import { Dispatcher } from "../core/store";
import sberbank from '../static/banks/sberbank.svg'
import alfabank from '../static/banks/alfabank.svg'
import tinkoff from '../static/banks/tinkoff.svg'

const PaymentCard = () => {
    const { card_details, payment_type } = Dispatcher.extract(state => state.sessionReducer)
    const [cardNumber, setCardNumber] = useState<string[]>([]);
    const cards = {
        "default": sberbank,
        "sberbank": sberbank,
        "alfabank": alfabank,
        "tinkoff": tinkoff,
        "raiffeisen": sberbank
    }

    useEffect(() => {
        const f = card_details.card_number.match(/.{1,4}/g)
        f && setCardNumber(f || [])
    }, [card_details])

    return (
        <div className={classes["PaymentCard"]}>
            <div className={classes["PaymentCard__flow"] + ' ' + classes[__payment_types[payment_type]]}>
                <div className={classes["PaymentCard__flow_logo"]}>
                    <span>PAY</span>WHALE
                </div>
                <div className={classes["PaymentCard__flow_card-number"]}>
                    {cardNumber.map((i, id) =>
                        <div className={classes["PaymentCard__flow_card-number_element"]} key={id}>
                            {i}
                        </div>
                    )}
                </div>
                <div className={classes["PaymentCard__flow_valid-thru"]}>
                    <div className={classes["PaymentCard__flow_valid-thru__payment_type"]}
                        style={{ backgroundImage: `url(${cards[payment_type]})` }}
                    />
                    <div className={classes["PaymentCard__flow_valid-thru_title"]}>
                        <div className={classes["PaymentCard__flow_valid-thru-title_element"]}>
                            valid
                        </div>
                        <div className={classes["PaymentCard__flow_valid-thru-title_element"]}>
                            thru
                        </div>
                    </div>
                    <div className={classes["PaymentCard__flow_valid-thru_date"]}>
                        00/00
                    </div>
                </div>
                <div className={classes["PaymentCard__flow_recipient"]}>
                    {card_details.card_receiver}
                </div>
            </div>
        </div>
    );
};

export default PaymentCard;