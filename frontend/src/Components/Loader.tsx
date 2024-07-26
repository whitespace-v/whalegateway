import React from 'react';
import classes from '../styles/Components/Loader.module.scss';

const Loader = () => {
    return (
        <div className={classes["Loader"]}>
            <div className={classes["Loader-content"]}/>
        </div>
    );
};

export default Loader;