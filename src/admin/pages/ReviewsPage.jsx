import React, { useState, useEffect } from 'react';
import useCRUD from '../hooks/useCRUD';
import AdminLayout from '../components/AdminLayout';
import DataTable from '../components/crud/DataTable';
import FormDialog from '../components/crud/FormDialog';
import DeleteConfirm from '../components/crud/DeleteConfirm';
import ImageField from '../components/crud/ImageField';

const ReviewsPage = () => {
  const {
    data: reviews,
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
  } = useCRUD('/reviews');

  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    description: '',
    active: true,
    image: null
  });

  useEffect(() => {
    if (currentItem) {
      setFormData({
        name: currentItem.name || '',
        jobTitle: currentItem.jobTitle || '',
        description: currentItem.description || '',
        active: currentItem.active !== undefined ? currentItem.active : true,
        image: currentItem.image || null
      });
    } else {
      setFormData({
        name: '',
        jobTitle: '',
        description: '',
        active: true,
        image: null
      });
    }
  }, [currentItem, isFormOpen]);

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('jobTitle', formData.jobTitle);
    data.append('description', formData.description);
    data.append('active', formData.active);
    
    if (formData.image instanceof File) {
      data.append('image', formData.image);
    } else if (typeof formData.image === 'string') {
      data.append('image', formData.image);
    }

    const result = await handleSave(data);
    if (!result.success) {
      alert(result.message);
    }
  };

  const columns = [
    { 
      key: 'image', 
      label: 'Photo', 
      render: (val) => val ? (
        <img src={`${process.env.REACT_APP_API_URL || ''}${val}`} alt="photo" className="w-10 h-10 object-cover bg-zinc-800 rounded-full border border-gold/20" />
      ) : <div className="w-10 h-10 bg-zinc-800 rounded-full border border-gold/10" />
    },
    { key: 'name', label: 'Name' },
    { key: 'jobTitle', label: 'Position' },
    { 
      key: 'description', 
      label: 'Review',
      render: (val) => <div className="max-w-xs truncate">{val}</div>
    },
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
        title="Reviews & Testimonials"
        columns={columns}
        data={reviews}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={currentItem ? "Edit Review" : "Add New Review"}
        onSubmit={handleSubmit}
        submitting={submitting}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-heading text-gold/70 uppercase tracking-widest font-semibold mb-2">
                Client Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-zinc-950 border border-gold/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold transition-colors font-body"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-heading text-gold/70 uppercase tracking-widest font-semibold mb-2">
                Job Title / Company
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full bg-zinc-950 border border-gold/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold transition-colors font-body"
              />
            </div>

            <div>
              <label className="block text-xs font-heading text-gold/70 uppercase tracking-widest font-semibold mb-2">
                Testimonial Text
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-zinc-950 border border-gold/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold transition-colors font-body h-32 resize-none"
                required
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
                <span className="text-xs font-heading text-gold/70 uppercase tracking-widest font-semibold">Active / Visible</span>
              </label>
            </div>
          </div>
          
          <div>
            <ImageField
              label="Client Photo"
              value={formData.image}
              onChange={(file) => setFormData({ ...formData, image: file })}
            />
          </div>
        </div>
      </FormDialog>

      <DeleteConfirm
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        itemName={currentItem?.name}
      />
    </AdminLayout>
  );
};

export default ReviewsPage;
