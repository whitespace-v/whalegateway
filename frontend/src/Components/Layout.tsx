import React from 'react';
import classes from '../styles/Components/Layout.module.scss';
import Footer from "./Footer";
import Header from "./Header";
import Navigation from "./Navigation";

const Layout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className={classes["Layout"]}>
            <Header/>
            {children}
            <Navigation/>
            <Footer/>
        </div>
    );
};

export default Layout;