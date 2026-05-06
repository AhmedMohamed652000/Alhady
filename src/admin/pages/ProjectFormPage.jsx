import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { Button } from '../../components/ui/button';
import ImageField from '../components/crud/ImageField';
import api from '../../utils/api';
import { Save, ChevronLeft, Plus, Trash2, Loader2 } from 'lucide-react';

const ProjectFormPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const isEdit = id && id !== 'new';
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    serviceCategory: '',
    link: '',
    order: 0,
    active: true,
    sliderImage: null,
    cardImage: null,
    projectDetails: {
      description1: '',
      description2: '',
      description3: '',
      clientName: '',
      location: '',
      date: '',
      category: ''
    },
    projectSamples: []
  });

  useEffect(() => {
    if (isEdit) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setFormData(response.data);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSample = () => {
    setFormData({
      ...formData,
      projectSamples: [
        ...formData.projectSamples,
        { title: '', subtitle: '', image: null }
      ]
    });
  };

  const handleRemoveSample = (index) => {
    const newSamples = [...formData.projectSamples];
    newSamples.splice(index, 1);
    setFormData({ ...formData, projectSamples: newSamples });
  };

  const handleSampleChange = (index, field, value) => {
    const newSamples = [...formData.projectSamples];
    newSamples[index][field] = value;
    setFormData({ ...formData, projectSamples: newSamples });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const data = new FormData();
      // Basic info
      data.append('title', formData.title);
      data.append('serviceCategory', formData.serviceCategory);
      data.append('link', formData.link);
      data.append('order', formData.order);
      data.append('active', formData.active);
      
      // Project Details (JSON string)
      data.append('projectDetails', JSON.stringify(formData.projectDetails));

      // Images
      if (formData.sliderImage instanceof File) data.append('sliderImage', formData.sliderImage);
      else if (formData.sliderImage) data.append('sliderImage', formData.sliderImage);

      if (formData.cardImage instanceof File) data.append('cardImage', formData.cardImage);
      else if (formData.cardImage) data.append('cardImage', formData.cardImage);

      // Samples metadata and files
      // We need to send samples as JSON and handle files separately or use a naming convention
      const samplesMetadata = formData.projectSamples.map((s, i) => ({
        title: s.title,
        subtitle: s.subtitle,
        image: s.image instanceof File ? null : s.image // If it's a file, we'll map it by index
      }));
      data.append('projectSamples', JSON.stringify(samplesMetadata));

      formData.projectSamples.forEach((sample, index) => {
        if (sample.image instanceof File) {
          data.append(`sampleImage_${index}`, sample.image);
        }
      });

      if (isEdit) {
        await api.put(`/projects/${id}`, data);
      } else {
        await api.post('/projects', data);
      }

      history.push('/admin/projects');
    } catch (err) {
      console.error('Error saving project:', err);
      setError(err.response?.data?.message || 'Failed to save project');
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
      <div className="space-y-6 pb-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => history.push('/admin/projects')}
              className="p-2 bg-zinc-900 rounded-full border border-gold/20 text-gold hover:bg-gold hover:text-black transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-3xl font-heading text-gold uppercase tracking-widest">
              {isEdit ? 'Edit Project' : 'New Project'}
            </h1>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-gold hover:bg-gold/80 text-black font-bold px-8 uppercase tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.3)]"
          >
            {saving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
            {saving ? 'Saving...' : 'Save Project'}
          </Button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-3 rounded font-body text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Info & Main Images */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6 bg-zinc-900/50 border border-gold/10 p-6 rounded-xl">
              <h2 className="text-lg font-heading text-gold/70 uppercase tracking-widest mb-4 border-b border-gold/10 pb-2">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Project Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2 text-white focus:border-gold/40 outline-none font-body"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Service Category</label>
                  <input
                    type="text"
                    value={formData.serviceCategory}
                    onChange={(e) => setFormData({...formData, serviceCategory: e.target.value})}
                    className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2 text-white focus:border-gold/40 outline-none font-body"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Custom Slug (optional)</label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    placeholder="/project-details"
                    className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2 text-white focus:border-gold/40 outline-none font-body"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Order</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                      className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2 text-white focus:border-gold/40 outline-none font-body"
                    />
                  </div>
                  <div className="flex flex-col justify-end pb-1">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData({...formData, active: e.target.checked})}
                        className="w-4 h-4 accent-gold"
                      />
                      <span className="text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold">Active</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <ImageField
                  label="Project Slider Image (Main Banner)"
                  value={formData.sliderImage}
                  onChange={(val) => setFormData({...formData, sliderImage: val})}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-zinc-900/50 border border-gold/10 p-6 rounded-xl">
                <ImageField
                  label="Card Image (Vertical)"
                  value={formData.cardImage}
                  onChange={(val) => setFormData({...formData, cardImage: val})}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Detailed Descriptions & Meta */}
          <div className="bg-zinc-900/50 border border-gold/10 p-6 rounded-xl space-y-6">
            <h2 className="text-lg font-heading text-gold/70 uppercase tracking-widest mb-4 border-b border-gold/10 pb-2">Project Details & Descriptions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Client Name</label>
                <input
                  type="text"
                  value={formData.projectDetails.clientName}
                  onChange={(e) => setFormData({
                    ...formData, 
                    projectDetails: { ...formData.projectDetails, clientName: e.target.value }
                  })}
                  className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2 text-white focus:border-gold/40 outline-none font-body text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Location</label>
                <input
                  type="text"
                  value={formData.projectDetails.location}
                  onChange={(e) => setFormData({
                    ...formData, 
                    projectDetails: { ...formData.projectDetails, location: e.target.value }
                  })}
                  className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2 text-white focus:border-gold/40 outline-none font-body text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Date / Year</label>
                <input
                  type="text"
                  value={formData.projectDetails.date}
                  onChange={(e) => setFormData({
                    ...formData, 
                    projectDetails: { ...formData.projectDetails, date: e.target.value }
                  })}
                  className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2 text-white focus:border-gold/40 outline-none font-body text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Project Category</label>
                <input
                  type="text"
                  value={formData.projectDetails.category}
                  onChange={(e) => setFormData({
                    ...formData, 
                    projectDetails: { ...formData.projectDetails, category: e.target.value }
                  })}
                  className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2 text-white focus:border-gold/40 outline-none font-body text-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Description Paragraph 1 (Overview)</label>
                <textarea
                  value={formData.projectDetails.description1}
                  onChange={(e) => setFormData({
                    ...formData, 
                    projectDetails: { ...formData.projectDetails, description1: e.target.value }
                  })}
                  className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2 text-white focus:border-gold/40 outline-none font-body h-24 resize-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Description Paragraph 2 (Challenge)</label>
                <textarea
                  value={formData.projectDetails.description2}
                  onChange={(e) => setFormData({
                    ...formData, 
                    projectDetails: { ...formData.projectDetails, description2: e.target.value }
                  })}
                  className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2 text-white focus:border-gold/40 outline-none font-body h-24 resize-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-heading text-gold/50 uppercase tracking-widest font-semibold mb-2">Description Paragraph 3 (Solution)</label>
                <textarea
                  value={formData.projectDetails.description3}
                  onChange={(e) => setFormData({
                    ...formData, 
                    projectDetails: { ...formData.projectDetails, description3: e.target.value }
                  })}
                  className="w-full bg-zinc-950 border border-gold/10 rounded px-4 py-2 text-white focus:border-gold/40 outline-none font-body h-24 resize-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Project Samples (Gallery) */}
          <div className="bg-zinc-900/50 border border-gold/10 p-6 rounded-xl space-y-6">
            <div className="flex items-center justify-between mb-4 border-b border-gold/10 pb-2">
              <h2 className="text-lg font-heading text-gold/70 uppercase tracking-widest">Project Samples / Gallery</h2>
              <button
                type="button"
                onClick={handleAddSample}
                className="flex items-center space-x-2 text-xs font-heading text-gold uppercase tracking-widest border border-gold/30 px-3 py-1.5 rounded hover:bg-gold hover:text-black transition-all"
              >
                <Plus size={14} />
                <span>Add Sample</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.projectSamples.map((sample, index) => (
                <div key={index} className="bg-zinc-950 border border-gold/10 p-4 rounded-lg relative group">
                  <button
                    type="button"
                    onClick={() => handleRemoveSample(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-heading text-gold/40 uppercase tracking-widest font-semibold mb-1">Sample Title</label>
                        <input
                          type="text"
                          value={sample.title}
                          onChange={(e) => handleSampleChange(index, 'title', e.target.value)}
                          className="w-full bg-zinc-900 border border-gold/10 rounded px-3 py-1.5 text-white focus:border-gold/40 outline-none font-body text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-heading text-gold/40 uppercase tracking-widest font-semibold mb-1">Subtitle</label>
                        <input
                          type="text"
                          value={sample.subtitle}
                          onChange={(e) => handleSampleChange(index, 'subtitle', e.target.value)}
                          className="w-full bg-zinc-900 border border-gold/10 rounded px-3 py-1.5 text-white focus:border-gold/40 outline-none font-body text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <ImageField
                        label="Sample Image"
                        value={sample.image}
                        onChange={(val) => handleSampleChange(index, 'image', val)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {formData.projectSamples.length === 0 && (
                <div className="md:col-span-2 py-12 text-center border border-dashed border-gold/10 rounded-xl text-zinc-600 font-body italic">
                  No samples added yet. Click "Add Sample" to start building the gallery.
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProjectFormPage;
