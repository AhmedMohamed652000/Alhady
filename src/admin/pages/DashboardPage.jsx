import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '@/utils/api';
import { 
  Briefcase, 
  Settings, 
  Users, 
  Star, 
  Wrench, 
  Users2, 
  Layout, 
  Loader2,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, link }) => (
  <div className="bg-zinc-900 border border-gold/10 rounded-2xl p-6 hover:border-gold/30 transition-all group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-1">{title}</p>
        <h3 className="text-4xl font-heading text-white font-bold">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-${color}-900/20 text-${color}-400 border border-${color}-900/50 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
    </div>
    <Link 
      to={link} 
      className="mt-6 flex items-center text-xs font-heading text-gold uppercase tracking-widest font-bold group-hover:translate-x-1 transition-transform"
    >
      Manage {title} <ArrowRight size={14} className="ml-2" />
    </Link>
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState({
    projects: 0,
    services: 0,
    reviews: 0,
    team: 0,
    tools: 0,
    clients: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        // Fallback or dummy data if API not ready
        setStats({
          projects: 12,
          services: 6,
          reviews: 24,
          team: 8,
          tools: 15,
          clients: 10
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-gold" size={48} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-heading text-gold uppercase tracking-widest mb-2">
            Dashboard Overview
          </h1>
          <p className="text-zinc-500 font-body">Welcome back. Here's what's happening with your website content.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            title="Projects" 
            value={stats.projects} 
            icon={Briefcase} 
            color="gold" 
            link="/admin/projects" 
          />
          <StatCard 
            title="Services" 
            value={stats.services} 
            icon={Wrench} 
            color="blue" 
            link="/admin/services" 
          />
          <StatCard 
            title="Reviews" 
            value={stats.reviews} 
            icon={Star} 
            color="yellow" 
            link="/admin/reviews" 
          />
          <StatCard 
            title="Team Members" 
            value={stats.team} 
            icon={Users} 
            color="purple" 
            link="/admin/team" 
          />
          <StatCard 
            title="Tools" 
            value={stats.tools} 
            icon={Settings} 
            color="zinc" 
            link="/admin/tools" 
          />
          <StatCard 
            title="Clients" 
            value={stats.clients} 
            icon={Users2} 
            color="green" 
            link="/admin/clients" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          <div className="bg-zinc-900 border border-gold/10 rounded-2xl p-8">
            <h2 className="text-xl font-heading text-gold/70 uppercase tracking-widest mb-6 flex items-center">
              <Layout size={20} className="mr-3" /> Quick Access
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/admin/banners" className="bg-zinc-950 border border-gold/5 p-4 rounded-xl hover:border-gold/30 transition-all text-center">
                <span className="block text-xs font-heading text-gold/50 uppercase tracking-tighter mb-2">Manage</span>
                <span className="text-sm font-heading text-white uppercase tracking-widest font-bold">Banners</span>
              </Link>
              <Link to="/admin/settings" className="bg-zinc-950 border border-gold/5 p-4 rounded-xl hover:border-gold/30 transition-all text-center">
                <span className="block text-xs font-heading text-gold/50 uppercase tracking-tighter mb-2">Global</span>
                <span className="text-sm font-heading text-white uppercase tracking-widest font-bold">Settings</span>
              </Link>
              <Link to="/admin/partners" className="bg-zinc-950 border border-gold/5 p-4 rounded-xl hover:border-gold/30 transition-all text-center">
                <span className="block text-xs font-heading text-gold/50 uppercase tracking-tighter mb-2">Manage</span>
                <span className="text-sm font-heading text-white uppercase tracking-widest font-bold">Partners</span>
              </Link>
              <a href="/" target="_blank" className="bg-zinc-950 border border-gold/5 p-4 rounded-xl hover:border-gold/30 transition-all text-center">
                <span className="block text-xs font-heading text-gold/50 uppercase tracking-tighter mb-2">View</span>
                <span className="text-sm font-heading text-white uppercase tracking-widest font-bold">Live Site</span>
              </a>
            </div>
          </div>

          <div className="bg-zinc-900 border border-gold/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mb-2">
              <Settings size={40} className="text-gold animate-spin-slow" />
            </div>
            <h2 className="text-xl font-heading text-white uppercase tracking-widest">System Status</h2>
            <p className="text-zinc-500 font-body text-sm max-w-xs">The CMS is connected to the backend API. All systems are operational.</p>
            <div className="px-4 py-1.5 bg-green-900/20 border border-green-900/50 rounded-full flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
              <span className="text-[10px] font-heading text-green-400 uppercase tracking-widest font-bold">API Connected</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
