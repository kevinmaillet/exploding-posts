import React from 'react';

const Layout = ({ children }) => {
    return (
        <>
            <header className='w-full p-6 shadow-md mb-12 bg-indigo-800'><h1 className='text-2xl text-slate-50'>Posts Dashboard</h1></header>
            <main className='container mx-auto flex flex-wrap'>
                {children}
            </main>
        </>
    )

}

export default Layout;