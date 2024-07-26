import React from 'react';
import classes from '../styles/Components/Navigation.module.scss';


const Navigation = () => {
    return (
        <div className={classes["Navigation"]}>
            <div className={classes["Navigation__element"]}>
                Информация оплаты
            </div>
            <div className={classes["Navigation__element"]}>
                Стать клиентом <span>PAY</span>WHALE
            </div>
        </div>
    );
};

export default Navigation;