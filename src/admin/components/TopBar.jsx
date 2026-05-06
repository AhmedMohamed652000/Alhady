import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { clearToken } from '../hooks/useAuth';
import { LogOut } from 'lucide-react';

const TopBar = () => {
    const history = useHistory();

    const handleLogout = () => {
        clearToken();
        history.push('/admin/login');
    };

    return (
        <header className="h-16 border-b border-gold bg-black flex items-center justify-between px-6 sticky top-0 z-50">
            <h1 className="font-heading text-2xl text-gold uppercase tracking-widest">
                Al-Hady Admin
            </h1>
            <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-2 border-gold text-gold hover:bg-gold hover:text-black"
            >
                <LogOut size={16} />
                <span className="hidden sm:inline uppercase font-heading tracking-wider">Logout</span>
            </Button>
        </header>
    );
};

export default TopBar;
