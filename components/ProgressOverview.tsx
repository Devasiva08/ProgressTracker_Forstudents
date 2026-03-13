import { DefaultTask } from './Dashboard';
import { CheckCircle2, Circle, PlayCircle } from 'lucide-react';

export default function ProgressOverview({ tasks }: { tasks: DefaultTask[] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex-1 w-full">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Overall Progress</h2>
        <div className="flex items-center gap-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden relative">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span className="font-bold text-xl text-blue-600 dark:text-blue-400">{percentage}%</span>
        </div>
      </div>

      <div className="flex gap-6 w-full md:w-auto">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-lg">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Completed</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{completed}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg">
            <PlayCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Focusing</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{inProgress}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-lg">
            <Circle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Pending</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{total - completed - inProgress}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
