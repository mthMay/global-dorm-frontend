import React from 'react';
import Header from './Header';

// code modified from https://dev.to/olenadrugalya/layout-component-and-why-we-use-it-in-react-d8b (Drugalya, 2020)
const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <main>{children}</main>
        </>
    );
};

export default Layout;
