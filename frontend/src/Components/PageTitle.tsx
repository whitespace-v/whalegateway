import React from 'react';
import classes from '../styles/Components/PageTitle.module.scss';
import {Dispatcher} from "../core/store";

const PageTitle = ({children}: {children: string}) => {
    const {amount} = Dispatcher.extract(state => state.sessionReducer)
    return (
        <div className={classes["PageTitle"]}>
            <div className={classes["PageTitle__title"]}>
                {children}
            </div>
            <div className={classes["PageTitle__amount"]}>
                К оплате: <span>{amount} ₽</span>
            </div>
        </div>
    );
};

export default PageTitle;