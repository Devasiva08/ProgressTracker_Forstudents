import { DefaultTask } from './Dashboard';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function TaskModal({
  task,
  onClose,
  onSuccess,
}: {
  task: DefaultTask | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    scheduleLabel: '',
    color: 'bg-blue-100 dark:bg-blue-900 border-blue-500',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'Not Started',
    progress: 0,
    order: 100,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        category: task.category,
        scheduleLabel: task.scheduleLabel,
        color: task.color,
        startDate: format(new Date(task.startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(task.endDate), 'yyyy-MM-dd'),
        status: task.status,
        progress: task.progress,
        order: task.order,
      });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = task ? `/api/tasks/${task._id}` : '/api/tasks';
      const method = task ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onSuccess();
      } else {
        alert('Failed to save task');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const colors = [
    { name: 'Blue', value: 'bg-blue-100 dark:bg-blue-900 border-blue-500' },
    { name: 'Green', value: 'bg-green-100 dark:bg-green-900 border-green-500' },
    { name: 'Yellow', value: 'bg-yellow-100 dark:bg-yellow-900 border-yellow-500' },
    { name: 'Orange', value: 'bg-orange-100 dark:bg-orange-900 border-orange-500' },
    { name: 'Red', value: 'bg-red-100 dark:bg-red-900 border-red-500' },
    { name: 'Purple', value: 'bg-purple-100 dark:bg-purple-900 border-purple-500' },
    { name: 'Pink', value: 'bg-pink-100 dark:bg-pink-900 border-pink-500' },
    { name: 'Teal', value: 'bg-teal-100 dark:bg-teal-900 border-teal-500' },
    { name: 'Gray', value: 'bg-gray-100 dark:bg-gray-800 border-gray-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {task ? 'Edit Task' : 'Add Custom Task'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., CI/CD"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Schedule Label</label>
              <input
                type="text"
                required
                value={formData.scheduleLabel}
                onChange={(e) => setFormData({ ...formData, scheduleLabel: e.target.value })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., Week 7"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color Theme</label>
            <select
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {colors.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
