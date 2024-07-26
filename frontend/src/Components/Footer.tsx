import React from 'react';
import classes from '../styles/Components/Footer.module.scss';
import icon_shield from '../static/svg/shield.svg'

import icon_visa from '../static/verif/visa.svg'
import icon_mastercard from '../static/verif/mastercard.svg'
import icon_pci_dss from '../static/verif/pci-dss.svg'

const Footer = () => {
    return (
        <div className={classes["Footer"]}>
                <div className={classes["Footer__secure"]}>
                    <div className={classes["Footer__secure-icon"]}
                         style={{backgroundImage: `url(${icon_shield})`}}
                    />
                    <div className={classes["Footer__secure-text"]}>
                        Гарантия безопасной сделки обеспечивается
                    </div>
                </div>
                <div className={classes["Footer__verification"]}>
                    {[icon_visa, icon_mastercard, icon_pci_dss].map((i, id) => (
                        <div className={classes["Footer__verification_item"]} key={id}
                             style={{backgroundImage: `url(${i})`}}
                        />
                    ))}
                </div>
                <div className={classes["Footer__support-text"]}>
                    Нужна помощь? Напишите нам на <span>support@paywhale.ru</span>
                </div>
        </div>
    );
};

export default Footer;