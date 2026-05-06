import React from 'react';
import { Button } from '../../../components/ui/button';

const DataTable = ({
  title,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  loading = false,
  addLabel = "Add New"
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-heading text-gold uppercase tracking-widest">
          {title}
        </h1>
        <Button 
          onClick={onAdd}
          className="bg-gold hover:bg-gold/80 text-black font-bold px-6 py-2 rounded uppercase tracking-wider"
        >
          {addLabel}
        </Button>
      </div>

      <div className="bg-zinc-900 border border-gold/30 rounded-lg overflow-hidden overflow-x-auto shadow-2xl">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-gold/20 bg-zinc-950/50">
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className="px-6 py-4 text-xs font-heading text-gold/70 uppercase tracking-widest font-semibold"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-4 text-xs font-heading text-gold/70 uppercase tracking-widest font-semibold text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {loading ? (
              // Skeleton rows
              [...Array(3)].map((_, i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
                  {columns.map((col) => (
                    <td key={`skeleton-col-${col.key}`} className="px-6 py-4">
                      <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <div className="h-8 bg-zinc-800 rounded w-24 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + 1} 
                  className="px-6 py-12 text-center text-zinc-500 font-body italic"
                >
                  No data found.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item._id} className="hover:bg-white/5 transition-colors group">
                  {columns.map((col) => (
                    <td key={`${item._id}-${col.key}`} className="px-6 py-4 text-zinc-300 font-body text-sm">
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                      className="border-gold/30 text-gold hover:bg-gold hover:text-black transition-all duration-300"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(item)}
                      className="border-red-900/50 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-300"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
