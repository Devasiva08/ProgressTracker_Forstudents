import { DefaultTask } from './Dashboard';
import { format } from 'date-fns';

export default function TimelineView({ tasks }: { tasks: DefaultTask[] }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No tasks to display on the timeline.
      </div>
    );
  }

  // Sort tasks chronologically by start date
  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-4 md:ml-6 mt-4 mb-8">
      {sortedTasks.map((task, index) => {
        // Extract base color class for the dot from the task's color string
        // e.g. 'bg-blue-100 dark:bg-blue-900 border-blue-500' -> we want a solid dot, maybe 'bg-blue-500'
        const borderMatch = task.color.match(/border-([a-z]+-500)/);
        const dotColor = borderMatch ? `bg-${borderMatch[1]}` : 'bg-gray-500';

        return (
          <div key={task._id} className="mb-10 ml-6 group">
            {/* Timeline Dot */}
            <span
              className={`absolute flex items-center justify-center w-4 h-4 rounded-full -left-[9px] ring-4 ring-white dark:ring-gray-900 ${dotColor}`}
            ></span>

            <div className={`p-4 rounded-lg shadow-sm border border-l-4 ${task.color} bg-white dark:bg-gray-800 transition-all hover:-translate-y-1`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-widest uppercase">
                  {task.scheduleLabel}
                </span>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                  {format(new Date(task.startDate), 'MMM dd')} -{' '}
                  {format(new Date(task.endDate), 'MMM dd, yyyy')}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{task.title}</h3>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {task.category}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                    ${
                      task.status === 'Completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : task.status === 'In Progress'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {task.status}
                  </span>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {task.progress}%
                  </span>
                </div>
              </div>

              {/* Minimal Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 mt-4 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-1 transition-all"
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
