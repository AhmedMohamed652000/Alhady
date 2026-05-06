import React, { useState, useEffect } from 'react';
import api from '@/admin/services/api';
import DataTable from '@/admin/components/crud/DataTable';
import FormDialog from '@/admin/components/crud/FormDialog';
import DeleteConfirm from '@/admin/components/crud/DeleteConfirm';
import ImageField from '@/admin/components/crud/ImageField';
import Notification from '@/admin/components/Notification';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ToolsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', icon: '', order: 0, active: true });
  const [editId, setEditId] = useState(null);
  
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/tools');
      setData(res.data.data || []);
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to fetch tools' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData({ title: '', icon: '', order: data.length, active: true });
    setFormOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditId(item._id);
    setFormData({
      title: item.title,
      icon: item.icon,
      order: item.order,
      active: item.active
    });
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (editId) {
        await api.put(`/api/tools/${editId}`, formData);
        setNotification({ type: 'success', message: 'Tool updated successfully' });
      } else {
        await api.post('/api/tools', formData);
        setNotification({ type: 'success', message: 'Tool added successfully' });
      }
      setFormOpen(false);
      fetchData();
    } catch (err) {
      setNotification({ type: 'error', message: err.response?.data?.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/api/tools/${deleteTarget._id}`);
      setNotification({ type: 'success', message: 'Tool deleted successfully' });
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to delete tool' });
    }
  };

  const columns = [
    { 
      key: 'icon', 
      label: 'Icon', 
      render: (val) => val ? (
        <img src={`http://localhost:5000${val}`} alt="icon" className="w-8 h-8 object-contain bg-zinc-800 rounded p-1" />
      ) : <div className="w-8 h-8 bg-zinc-800 rounded" />
    },
    { key: 'title', label: 'Title' },
    { key: 'order', label: 'Order' },
    { 
      key: 'active', 
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${val ? 'bg-green-900/30 text-green-400 border border-green-700/30' : 'bg-red-900/30 text-red-400 border border-red-700/30'}`}>
          {val ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];

  return (
    <div className="p-6">
      <Notification 
        type={notification.type} 
        message={notification.message} 
        onClose={() => setNotification({ type: '', message: '' })} 
      />

      <DataTable
        title="Tools & Technologies"
        columns={columns}
        data={data}
        loading={loading}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={setDeleteTarget}
        addLabel="Add Tool"
      />

      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? "Edit Tool" : "Add New Tool"}
        onSubmit={handleSubmit}
        submitting={submitting}
      >
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Tool Title</Label>
            <Input 
              id="title" 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Revit, AutoCAD, Rhino"
              required
            />
          </div>
          
          <ImageField 
            label="Tool Icon"
            value={formData.icon}
            onChange={(val) => setFormData({...formData, icon: val})}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="order">Display Order</Label>
              <Input 
                id="order" 
                type="number"
                value={formData.order} 
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
              />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <input 
                id="active" 
                type="checkbox"
                checked={formData.active} 
                onChange={(e) => setFormData({...formData, active: e.target.checked})}
                className="w-4 h-4 accent-gold"
              />
              <Label htmlFor="active">Active Status</Label>
            </div>
          </div>
        </div>
      </FormDialog>

      <DeleteConfirm
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.title}
      />
    </div>
  );
};

export default ToolsPage;
