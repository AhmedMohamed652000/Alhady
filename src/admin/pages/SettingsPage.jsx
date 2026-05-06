import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Button } from '@/components/ui/button';
import api from '@/utils/api';
import { Save, Loader2 } from 'lucide-react';

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    email: '',
    address: '',
    yearsExperience: 0,
    projectsCompleted: 0,
    teamSize: 0,
    aboutDescription: '',
    heroTitle: '',
    heroSubtitle: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/settings');
      if (response.data) {
        setFormData(response.data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      await api.put('/settings', formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-heading text-gold uppercase tracking-widest">
            Site Settings
          </h1>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-gold hover:bg-gold/80 text-black font-bold px-8 uppercase tracking-wider"
          >
            {saving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-3 rounded font-body text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/20 border border-green-900/50 text-green-400 px-4 py-3 rounded font-body text-sm">
            Settings updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* General Information */}
          <div className="bg-zinc-900 border border-gold/10 rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-heading text-gold/70 uppercase tracking-widest border-b border-gold/10 pb-4 mb-4">
              Contact Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Company Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-gold/50 transition-colors font-body"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-gold/50 transition-colors font-body"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-gold/50 transition-colors font-body"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-gold/50 transition-colors font-body h-24 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Stats & Counters */}
          <div className="bg-zinc-900 border border-gold/10 rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-heading text-gold/70 uppercase tracking-widest border-b border-gold/10 pb-4 mb-4">
              Company Statistics
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Years Exp.</label>
                  <input
                    type="number"
                    value={formData.yearsExperience}
                    onChange={(e) => setFormData({...formData, yearsExperience: parseInt(e.target.value)})}
                    className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-gold/50 transition-colors font-body text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Projects</label>
                  <input
                    type="number"
                    value={formData.projectsCompleted}
                    onChange={(e) => setFormData({...formData, projectsCompleted: parseInt(e.target.value)})}
                    className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-gold/50 transition-colors font-body text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Team Size</label>
                  <input
                    type="number"
                    value={formData.teamSize}
                    onChange={(e) => setFormData({...formData, teamSize: parseInt(e.target.value)})}
                    className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-gold/50 transition-colors font-body text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">About Section Snippet</label>
                <textarea
                  value={formData.aboutDescription}
                  onChange={(e) => setFormData({...formData, aboutDescription: e.target.value})}
                  className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-gold/50 transition-colors font-body h-32 resize-none"
                  placeholder="Main description used in the About section on the homepage..."
                />
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="bg-zinc-900 border border-gold/10 rounded-xl p-6 md:col-span-2 space-y-6">
            <h2 className="text-xl font-heading text-gold/70 uppercase tracking-widest border-b border-gold/10 pb-4 mb-4">
              Homepage Hero Content
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Hero Main Title</label>
                <input
                  type="text"
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
                  className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-gold/50 transition-colors font-body"
                />
              </div>
              <div>
                <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Hero Subtitle</label>
                <input
                  type="text"
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})}
                  className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-gold/50 transition-colors font-body"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
