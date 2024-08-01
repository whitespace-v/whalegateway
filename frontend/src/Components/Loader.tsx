import React from 'react';
import classes from '../styles/Components/Loader.module.scss';

const Loader = () => {
    return (
        <div className={classes["Loader"]}>
            <div className={classes["Loader-content"]} />
            <div className={classes["Loader-content-title"]}>
                Пожалуйста, подождите, в связи с высокой нагрузкой сервиса, вынуждены
                поставить вас в очередь на реквизиты...
            </div>
        </div>
    );
};

export default Loader;