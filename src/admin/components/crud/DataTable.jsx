import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Plus } from "lucide-react";

const DataTable = ({
  title,
  columns,
  data = [],
  onAdd,
  onEdit,
  onDelete,
  loading = false,
  addLabel = "Add New"
}) => {
  if (loading) {
    return (
      <div className="bg-zinc-900 border border-gold/30 rounded-lg p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-heading text-gold uppercase tracking-widest">{title}</h2>
          <Button disabled className="opacity-50"><Plus className="w-4 h-4 mr-2" /> {addLabel}</Button>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-zinc-800/50 rounded animate-pulse w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-gold/30 rounded-lg p-4 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-3xl font-heading text-gold uppercase tracking-widest">{title}</h2>
        <Button onClick={onAdd} variant="default">
          <Plus className="w-4 h-4 mr-2" /> {addLabel}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gold/10">
              {columns.map((col) => (
                <th key={col.key} className="py-3 px-4 text-gold/70 font-heading uppercase text-xs tracking-wider">
                  {col.label}
                </th>
              ))}
              <th className="py-3 px-4 text-gold/70 font-heading uppercase text-xs tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/5">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-8 text-center text-zinc-500 font-body">
                  No items found.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={row._id || rowIndex} className="hover:bg-zinc-800/30 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="py-3 px-4 text-zinc-300 font-body">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(row)}
                      className="h-8 w-8 p-0"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-gold" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(row)}
                      className="h-8 w-8 p-0 border-red-900/50 hover:bg-red-900/20"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
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
