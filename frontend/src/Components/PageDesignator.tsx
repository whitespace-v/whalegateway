import React from 'react';
import classes from '../styles/Components/PageDesignator.module.scss';

const PageDesignator = ({children}: {children: string}) => {
    return (
        <div className={classes["PageDesignator"]}>
            {children}
        </div>
    );
};

export default PageDesignator;