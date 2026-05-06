import React from 'react';
import AdminLayout from '../components/AdminLayout';

const ToolsPage = () => {
    return (
        <AdminLayout>
            <div className="space-y-4">
                <h2 className="text-3xl font-heading text-gold uppercase tracking-widest">Tools</h2>
                <p className="text-gray-400">Content management for Tools is coming in Phase 3.</p>
                <div className="h-64 border border-dashed border-gold/30 rounded-xl flex items-center justify-center text-gold/20 font-heading text-xl uppercase italic">
                    Placeholder: Tools CRUD Management
                </div>
            </div>
        </AdminLayout>
    );
};

export default ToolsPage;
