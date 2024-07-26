import React, {useEffect} from 'react';
import classes from '../styles/Components/From.module.scss';
import {Dispatcher} from "../core/store";
const From = () => {
    const {domain} = Dispatcher.extract(state => state.sessionReducer)
    const [callbackDomain, setCallbackDomain] = React.useState<string>('')

    useEffect(() => {
        if (domain){
            setCallbackDomain (new URL(domain).hostname)
        }
    }, [domain]);

    return (
        <div className={classes["From"]}>
            <div className={classes["From__favicon"]}
                 style={{backgroundImage: `url(${domain}/favicon.ico)`}}
            />
            <div className={classes["From__link"]}>
                {callbackDomain}
            </div>
        </div>
    );
};

export default From;