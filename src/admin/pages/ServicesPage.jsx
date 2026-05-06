import React, { useState, useEffect } from 'react';
import useCRUD from '../hooks/useCRUD';
import AdminLayout from '../components/AdminLayout';
import DataTable from '../components/crud/DataTable';
import FormDialog from '../components/crud/FormDialog';
import DeleteConfirm from '../components/crud/DeleteConfirm';
import ImageField from '../components/crud/ImageField';

const ServicesPage = () => {
  const {
    data: services,
    loading,
    submitting,
    isFormOpen,
    setIsFormOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    currentItem,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    confirmDelete
  } = useCRUD('/services');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    order: 0,
    active: true,
    icon: null,
    cardImage: null,
    sliderImage: null
  });

  useEffect(() => {
    if (currentItem) {
      setFormData({
        title: currentItem.title || '',
        description: currentItem.description || '',
        link: currentItem.link || '',
        order: currentItem.order || 0,
        active: currentItem.active !== undefined ? currentItem.active : true,
        icon: currentItem.icon || null,
        cardImage: currentItem.cardImage || null,
        sliderImage: currentItem.sliderImage || null
      });
    } else {
      setFormData({
        title: '',
        description: '',
        link: '',
        order: 0,
        active: true,
        icon: null,
        cardImage: null,
        sliderImage: null
      });
    }
  }, [currentItem, isFormOpen]);

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('link', formData.link);
    data.append('order', formData.order);
    data.append('active', formData.active);
    
    // Handle multiple files
    if (formData.icon instanceof File) data.append('icon', formData.icon);
    else if (formData.icon) data.append('icon', formData.icon);

    if (formData.cardImage instanceof File) data.append('cardImage', formData.cardImage);
    else if (formData.cardImage) data.append('cardImage', formData.cardImage);

    if (formData.sliderImage instanceof File) data.append('sliderImage', formData.sliderImage);
    else if (formData.sliderImage) data.append('sliderImage', formData.sliderImage);

    const result = await handleSave(data);
    if (!result.success) {
      alert(result.message);
    }
  };

  const columns = [
    { 
      key: 'icon', 
      label: 'Icon', 
      render: (val) => val ? (
        <img src={`${process.env.REACT_APP_API_URL || ''}${val}`} alt="icon" className="w-8 h-8 object-contain" />
      ) : null
    },
    { key: 'title', label: 'Title' },
    { key: 'order', label: 'Order' },
    { 
      key: 'active', 
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded text-xs uppercase tracking-tighter font-bold ${val ? 'bg-green-900/30 text-green-400 border border-green-900/50' : 'bg-red-900/30 text-red-400 border border-red-900/50'}`}>
          {val ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];

  return (
    <AdminLayout>
      <DataTable
        title="Services Management"
        columns={columns}
        data={services}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={currentItem ? "Edit Service" : "Add New Service"}
        onSubmit={handleSubmit}
        submitting={submitting}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-heading text-gold/70 uppercase tracking-widest font-semibold mb-2">
                  Service Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-zinc-950 border border-gold/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold transition-colors font-body"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-heading text-gold/70 uppercase tracking-widest font-semibold mb-2">
                  Slug / Link
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/service-single"
                  className="w-full bg-zinc-950 border border-gold/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold transition-colors font-body"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading text-gold/70 uppercase tracking-widest font-semibold mb-2">
                Short Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-zinc-950 border border-gold/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold transition-colors font-body h-24 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-heading text-gold/70 uppercase tracking-widest font-semibold mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full bg-zinc-950 border border-gold/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold transition-colors font-body"
                />
              </div>
              <div className="flex flex-col justify-end pb-1">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${formData.active ? 'bg-gold' : 'bg-zinc-800'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-black w-4 h-4 rounded-full transition-transform ${formData.active ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <span className="text-xs font-heading text-gold/70 uppercase tracking-widest font-semibold">Active</span>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <ImageField
                label="Main Slider Image (Wide)"
                value={formData.sliderImage}
                onChange={(file) => setFormData({ ...formData, sliderImage: file })}
              />
            </div>
          </div>

          {/* Right Column: Images */}
          <div className="space-y-6">
            <ImageField
              label="Service Icon"
              value={formData.icon}
              onChange={(file) => setFormData({ ...formData, icon: file })}
            />
            
            <ImageField
              label="Card Image (Vertical)"
              value={formData.cardImage}
              onChange={(file) => setFormData({ ...formData, cardImage: file })}
            />
          </div>
        </div>
      </FormDialog>

      <DeleteConfirm
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        itemName={currentItem?.title}
      />
    </AdminLayout>
  );
};

export default ServicesPage;
