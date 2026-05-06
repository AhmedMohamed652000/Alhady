import React from 'react';
import { useHistory } from 'react-router-dom';
import useCRUD from '../hooks/useCRUD';
import AdminLayout from '../components/AdminLayout';
import DataTable from '../components/crud/DataTable';
import DeleteConfirm from '../components/crud/DeleteConfirm';

const ProjectsPage = () => {
  const history = useHistory();
  const {
    data: projects,
    loading,
    isDeleteOpen,
    setIsDeleteOpen,
    currentItem,
    handleDelete,
    confirmDelete
  } = useCRUD('/projects');

  const handleAdd = () => {
    history.push('/admin/projects/new');
  };

  const handleEdit = (item) => {
    history.push(`/admin/projects/${item._id}/edit`);
  };

  const columns = [
    { 
      key: 'cardImage', 
      label: 'Cover', 
      render: (val) => val ? (
        <img src={`${process.env.REACT_APP_API_URL || ''}${val}`} alt="project" className="w-12 h-12 object-cover bg-zinc-800 rounded border border-gold/20" />
      ) : <div className="w-12 h-12 bg-zinc-800 rounded border border-gold/10" />
    },
    { key: 'title', label: 'Project Name' },
    { key: 'serviceCategory', label: 'Service' },
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
        title="Projects Management"
        columns={columns}
        data={projects}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DeleteConfirm
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        itemName={currentItem?.title}
      />
    </AdminLayout>
  );
};

export default ProjectsPage;
