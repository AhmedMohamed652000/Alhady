import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import api from '../services/api';
import { 
    Image, 
    Briefcase, 
    Wrench, 
    Building, 
    Handshake, 
    Users, 
    MessageSquare, 
    FolderOpen, 
    FolderKanban 
} from 'lucide-react';

const DashboardPage = () => {
    const [counts, setCounts] = useState({
        banners: null,
        services: null,
        tools: null,
        clients: null,
        partners: null,
        team: null,
        reviews: null,
        portfolio: null,
        projects: null
    });
    const [loading, setLoading] = useState(true);

    const contentTypes = [
        { key: 'banners', label: 'Banners', endpoint: '/api/banners', icon: Image },
        { key: 'services', label: 'Services', endpoint: '/api/services', icon: Briefcase },
        { key: 'tools', label: 'Tools', endpoint: '/api/tools', icon: Wrench },
        { key: 'clients', label: 'Clients', endpoint: '/api/clients', icon: Building },
        { key: 'partners', label: 'Partners', endpoint: '/api/partners', icon: Handshake },
        { key: 'team', label: 'Team Members', endpoint: '/api/team', icon: Users },
        { key: 'reviews', label: 'Reviews', endpoint: '/api/reviews', icon: MessageSquare },
        { key: 'portfolio', label: 'Portfolio Items', endpoint: '/api/portfolio', icon: FolderOpen },
        { key: 'projects', label: 'Projects', endpoint: '/api/projects', icon: FolderKanban },
    ];

    useEffect(() => {
        const fetchCounts = async () => {
            setLoading(true);
            const results = await Promise.all(
                contentTypes.map(async (type) => {
                    try {
                        const response = await api.get(type.endpoint);
                        return { key: type.key, count: response.data.data.length };
                    } catch (error) {
                        console.error(`Failed to fetch count for ${type.key}:`, error);
                        return { key: type.key, count: null };
                    }
                })
            );

            const newCounts = {};
            results.forEach(res => {
                newCounts[res.key] = res.count;
            });
            setCounts(newCounts);
            setLoading(false);
        };

        fetchCounts();
    }, []);

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-heading text-gold uppercase tracking-widest">Dashboard Overview</h2>
                    <div className="text-xs text-gray-500 uppercase tracking-widest bg-neutral-900 px-3 py-1 rounded-full border border-gold/10">
                        System Status: Online
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(9)].map((_, i) => (
                            <Card key={i} className="animate-pulse border-gold/10">
                                <CardHeader className="h-24" />
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contentTypes.map((type) => {
                            const Icon = type.icon;
                            const count = counts[type.key];
                            
                            return (
                                <Card key={type.key} className="hover:border-gold transition-colors group">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                        <CardTitle className="text-sm font-medium text-gray-400 group-hover:text-gold transition-colors">
                                            {type.label}
                                        </CardTitle>
                                        <Icon size={18} className="text-gold opacity-50 group-hover:opacity-100 transition-opacity" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-4xl font-heading text-white">
                                            {count !== null ? count : <span className="text-gray-600">—</span>}
                                        </div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-tighter mt-1">
                                            Total published entries
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
                
                <Card className="border-dashed border-gold/20 bg-transparent">
                    <CardContent className="p-8 text-center space-y-2">
                        <p className="text-gold/40 font-heading text-xl uppercase tracking-widest italic">
                            Activity Log & Recent Changes
                        </p>
                        <p className="text-xs text-gray-700 uppercase tracking-widest">
                            Audit trail coming in Phase 4
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default DashboardPage;
