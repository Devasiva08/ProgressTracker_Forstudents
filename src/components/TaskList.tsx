import { DefaultTask } from './Dashboard';
import { format } from 'date-fns';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function TaskList({
  tasks,
  onUpdate,
  onEdit,
}: {
  tasks: DefaultTask[];
  onUpdate: () => void;
  onEdit: (task: DefaultTask) => void;
}) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const updateStatus = async (id: string, newStatus: string, newProgress: number) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, progress: newProgress }),
      });
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const updateProgress = async (id: string, progress: number) => {
    try {
      let status = 'In Progress';
      if (progress === 100) status = 'Completed';
      if (progress === 0) status = 'Not Started';

      await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress, status }),
      });
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No tasks scheduled. Click Generate Schedule or Add Custom Task.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task._id}
          className={`relative border-l-4 rounded-r-lg bg-gray-50 dark:bg-gray-800/50 p-4 transition-all hover:shadow-md ${task.color}`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {task.scheduleLabel}
                </span>
                <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                  {task.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{task.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {format(new Date(task.startDate), 'MMM dd, yyyy')} -{' '}
                {format(new Date(task.endDate), 'MMM dd, yyyy')}
              </p>
            </div>

            <div className="flex items-center gap-6">
              {/* Progress Slider */}
              <div className="flex flex-col gap-1 w-32 md:w-48">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 font-medium">
                  <span>Progress</span>
                  <span>{task.progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={task.progress}
                  onChange={(e) => updateProgress(task._id, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                />
              </div>

              {/* Status Select */}
              <select
                value={task.status}
                onChange={(e) => {
                  const val = e.target.value;
                  let prog = task.progress;
                  if (val === 'Completed') prog = 100;
                  if (val === 'Not Started') prog = 0;
                  if (val === 'In Progress' && prog === 0) prog = 10;
                  updateStatus(task._id, val, prog);
                }}
                className={`text-sm border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none
                  ${
                    task.status === 'Completed'
                      ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                      : task.status === 'In Progress'
                      ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800'
                      : 'bg-white text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                  }
                `}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              {/* Action Menu */}
              <div className="relative">
                <button
                  onClick={() => setOpenMenuId(openMenuId === task._id ? null : task._id)}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                >
                  <MoreVertical size={20} />
                </button>
                {openMenuId === task._id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                        onEdit(task);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                        deleteTask(task._id);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
