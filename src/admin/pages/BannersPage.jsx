import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Button } from '../../components/ui/button';
import ImageField from '../components/crud/ImageField';
import api from '../../utils/api';
import { Save, Loader2, Info } from 'lucide-react';

const PAGES = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'service', label: 'Services' },
  { id: 'project', label: 'Projects' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'team', label: 'Team' },
  { id: 'contact', label: 'Contact' },
  { id: 'faq', label: 'FAQ' }
];

const BannersPage = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [banners, setBanners] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Local state for the current active banner being edited
  const [currentBanner, setCurrentBanner] = useState({
    title: '',
    subtitle: '',
    backgroundImage: null
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners[activeTab]) {
      setCurrentBanner({
        title: banners[activeTab].title || '',
        subtitle: banners[activeTab].subtitle || '',
        backgroundImage: banners[activeTab].backgroundImage || null
      });
    } else {
      setCurrentBanner({
        title: '',
        subtitle: '',
        backgroundImage: null
      });
    }
  }, [activeTab, banners]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await api.get('/banners');
      // Convert array to object keyed by page for easy access
      const bannerMap = response.data.reduce((acc, banner) => {
        acc[banner.page] = banner;
        return acc;
      }, {});
      setBanners(bannerMap);
    } catch (err) {
      console.error('Error fetching banners:', err);
      setError('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const formData = new FormData();
      formData.append('title', currentBanner.title);
      formData.append('subtitle', currentBanner.subtitle);
      
      if (currentBanner.backgroundImage instanceof File) {
        formData.append('backgroundImage', currentBanner.backgroundImage);
      } else if (currentBanner.backgroundImage) {
        formData.append('backgroundImage', currentBanner.backgroundImage);
      }

      const response = await api.put(`/banners/${activeTab}`, formData);
      
      // Update local banners map
      setBanners(prev => ({
        ...prev,
        [activeTab]: response.data
      }));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving banner:', err);
      setError(err.response?.data?.message || 'Failed to save banner');
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
            Page Banners
          </h1>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gold hover:bg-gold/80 text-black font-bold px-8 uppercase tracking-wider"
          >
            {saving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
            {saving ? 'Save Banner' : 'Save Banner'}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gold/10 pb-px overflow-x-auto">
          {PAGES.map(page => (
            <button
              key={page.id}
              onClick={() => setActiveTab(page.id)}
              className={`px-6 py-3 text-xs font-heading uppercase tracking-widest font-semibold transition-all border-b-2 
                ${activeTab === page.id 
                  ? 'border-gold text-gold bg-gold/5' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                }`}
            >
              {page.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-3 rounded font-body text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/20 border border-green-900/50 text-green-400 px-4 py-3 rounded font-body text-sm">
            Banner for <span className="uppercase font-bold">{activeTab}</span> updated successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Edit Form */}
          <div className="bg-zinc-900 border border-gold/10 rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-heading text-gold/70 uppercase tracking-widest border-b border-gold/10 pb-4 mb-4 flex items-center">
              Edit {PAGES.find(p => p.id === activeTab)?.label} Banner
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Banner Title</label>
                <input
                  type="text"
                  value={currentBanner.title}
                  onChange={(e) => setCurrentBanner({...currentBanner, title: e.target.value})}
                  className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-gold/50 transition-colors font-body"
                  placeholder="The main text shown on the banner"
                />
              </div>

              <div>
                <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Banner Subtitle</label>
                <textarea
                  value={currentBanner.subtitle}
                  onChange={(e) => setCurrentBanner({...currentBanner, subtitle: e.target.value})}
                  className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-gold/50 transition-colors font-body h-24 resize-none"
                  placeholder="Optional secondary text"
                />
              </div>

              <ImageField
                label="Background Image"
                value={currentBanner.backgroundImage}
                onChange={(file) => setCurrentBanner({...currentBanner, backgroundImage: file})}
              />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-zinc-900 border border-gold/10 rounded-xl p-6">
            <h2 className="text-xl font-heading text-gold/70 uppercase tracking-widest border-b border-gold/10 pb-4 mb-4">
              Live Preview
            </h2>
            
            <div className="relative aspect-video rounded-lg overflow-hidden border border-gold/20 shadow-2xl group">
              {currentBanner.backgroundImage ? (
                <img 
                  src={currentBanner.backgroundImage instanceof File 
                    ? URL.createObjectURL(currentBanner.backgroundImage) 
                    : `${process.env.REACT_APP_API_URL || ''}${currentBanner.backgroundImage}`}
                  alt="Preview"
                  className="w-full h-full object-cover brightness-50"
                />
              ) : (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center italic text-zinc-700">
                  No background image selected
                </div>
              )}
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <h3 className="text-2xl md:text-3xl font-heading text-white uppercase tracking-[0.2em] font-bold mb-2">
                  {currentBanner.title || 'Page Title'}
                </h3>
                <div className="w-16 h-1 bg-gold mb-4"></div>
                <p className="text-zinc-300 font-body text-sm max-w-md">
                  {currentBanner.subtitle || 'Breadcrumbs / Subtitle text goes here'}
                </p>
              </div>

              <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full text-[10px] text-gold font-heading uppercase tracking-widest border border-gold/20 flex items-center">
                <Info size={12} className="mr-1.5" />
                Preview Mode
              </div>
            </div>

            <div className="mt-6 p-4 bg-zinc-950/50 rounded-lg border border-gold/5">
              <p className="text-xs text-zinc-500 font-body leading-relaxed italic">
                Note: This is a simplified preview of the banner. The actual website may use different fonts or overlay effects. Recommended image size: 1920x800px.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BannersPage;
