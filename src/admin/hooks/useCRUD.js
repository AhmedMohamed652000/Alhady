import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';

const useCRUD = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(endpoint);
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error(`Error fetching data from ${endpoint}:`, err);
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setCurrentItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item) => {
    setCurrentItem(item);
    setIsDeleteOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      setSubmitting(true);
      
      // If formData is an instance of FormData (file upload), axios handles it
      // Otherwise it's a JSON object
      
      if (currentItem) {
        // Update
        const response = await api.put(`${endpoint}/${currentItem._id}`, formData);
        setData(prev => prev.map(item => item._id === currentItem._id ? response.data : item));
      } else {
        // Create
        const response = await api.post(endpoint, formData);
        setData(prev => [...prev, response.data]);
      }
      
      setIsFormOpen(false);
      setCurrentItem(null);
      return { success: true };
    } catch (err) {
      console.error(`Error saving data to ${endpoint}:`, err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to save data' 
      };
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setSubmitting(true);
      await api.delete(`${endpoint}/${currentItem._id}`);
      setData(prev => prev.filter(item => item._id !== currentItem._id));
      setIsDeleteOpen(false);
      setCurrentItem(null);
      return { success: true };
    } catch (err) {
      console.error(`Error deleting data from ${endpoint}:`, err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to delete item' 
      };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    data,
    loading,
    error,
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
    confirmDelete,
    refresh: fetchData
  };
};

export default useCRUD;
