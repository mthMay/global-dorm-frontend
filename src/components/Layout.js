import React from 'react';
import Header from './Header'; // Adjust the import path as necessary

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <main>{children}</main>
        </>
    );
};

export default Layout;
