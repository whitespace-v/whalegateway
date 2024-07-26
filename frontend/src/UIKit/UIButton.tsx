import React from 'react';
import classes from '../styles/UIKit/UIButton.module.scss';

interface Props{
    children: React.ReactNode
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void
    type: 'disabled' | 'enabled'
}

const UIButton = (props: Props) => {
    return (
        <div className={`${classes['UIButton']} ${classes[props.type]}`}
             onClick={props.type ==='enabled' ? props.onClick : () => {}}
        >
            {props.children}
        </div>
    );
};

export default UIButton;