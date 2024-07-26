import React from 'react';
import classes from '../styles/Components/Header.module.scss';

const Header = () => {
    return (
        <div className={classes["Header"]}>
            <div className={classes["Header__title"]}>
                <div className={classes["Header__title-logo"]}>
                    <span>PAY</span>WHALE
                </div>
                <div className={classes["Header__title-text"]}>
                    Платежный шлюз
                </div>
            </div>
        </div>
    );
};

export default Header;