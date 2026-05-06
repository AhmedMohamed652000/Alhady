import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Image, 
    Briefcase, 
    Wrench, 
    Building, 
    Handshake, 
    Users, 
    MessageSquare, 
    FolderOpen, 
    FolderKanban, 
    Settings 
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Banners', path: '/admin/banners', icon: Image },
        { label: 'Services', path: '/admin/services', icon: Briefcase },
        { label: 'Tools', path: '/admin/tools', icon: Wrench },
        { label: 'Clients', path: '/admin/clients', icon: Building },
        { label: 'Partners', path: '/admin/partners', icon: Handshake },
        { label: 'Team', path: '/admin/team', icon: Users },
        { label: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
        { label: 'Portfolio', path: '/admin/portfolio', icon: FolderOpen },
        { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
        { label: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-black border-r border-gold min-h-screen flex flex-col sticky top-0 h-screen">
            <div className="p-6">
                <div className="text-gold font-heading text-xl uppercase tracking-tighter opacity-50 mb-8">
                    Navigation
                </div>
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                                    isActive 
                                        ? 'bg-gold text-black font-semibold' 
                                        : 'text-gray-400 hover:text-gold hover:bg-gold/10'
                                }`}
                            >
                                <Icon size={20} className={isActive ? 'text-black' : 'group-hover:text-gold'} />
                                <span className="font-body text-sm tracking-wide">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
            <div className="mt-auto p-6 border-t border-gold/20">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest text-center">
                    Al-Hady Engineering CMS v1.0
                </p>
            </div>
        </aside>
    );
};

export default Sidebar;
