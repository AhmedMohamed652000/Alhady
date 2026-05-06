import React from 'react';
import '../admin.css';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const AdminLayout = ({ children }) => {
    return (
        <div className="flex bg-black min-h-screen text-white font-body">
            {/* Sidebar remains visible on screens 768px+ (md) per requirements */}
            <Sidebar />
            
            <div className="flex-1 flex flex-col min-w-0">
                <TopBar />
                
                <main className="flex-1 p-8 overflow-auto bg-neutral-950">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
