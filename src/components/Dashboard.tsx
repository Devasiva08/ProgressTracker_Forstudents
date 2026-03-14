'use client';

import { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TimelineView from './TimelineView';
import ProgressOverview from './ProgressOverview';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format, isBefore, startOfToday } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';
import TaskModal from './TaskModal';

export interface DefaultTask {
  _id: string;
  title: string;
  category: string;
  scheduleLabel: string;
  color: string;
  startDate: string;
  endDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  progress: number;
  order: number;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<DefaultTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'timeline'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<DefaultTask | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const json = await res.json();
      if (json.success) {
        setTasks(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tasks/seed', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        fetchTasks();
      } else {
        alert(json.message || 'Error seeding database');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (tasks.length === 0) return alert('No tasks to export.');
    
    const headers = ['Title', 'Category', 'Schedule', 'Start Date', 'End Date', 'Status', 'Progress (%)'];
    const rows = tasks.map(t => [
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      `"${t.scheduleLabel}"`,
      format(new Date(t.startDate), 'yyyy-MM-dd'),
      format(new Date(t.endDate), 'yyyy-MM-dd'),
      t.status,
      t.progress
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `devops-dsa-schedule-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (tasks.length === 0) return alert('No tasks to export.');
    
    const doc = new jsPDF();
    doc.text('DevOps & DSA Learning Track', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy')}`, 14, 22);
    
    const tableData = tasks.map(t => [
      t.title,
      t.category,
      t.scheduleLabel,
      format(new Date(t.startDate), 'MMM dd'),
      t.status,
      `${t.progress}%`
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['Title', 'Category', 'Schedule', 'Start', 'Status', 'Progress']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save(`devops-dsa-schedule-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Check for pending/overdue tasks to notify user
  useEffect(() => {
    if (tasks.length > 0) {
      const today = startOfToday();
      const overdueTasks = tasks.filter(
        (t) => t.status !== 'Completed' && isBefore(new Date(t.endDate), today)
      );
      
      const dueTodayTasks = tasks.filter(
        (t) => t.status !== 'Completed' && format(new Date(t.endDate), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
      );

      if (overdueTasks.length > 0) {
        toast.error(`You have ${overdueTasks.length} overdue task(s)!`, {
          duration: 5000,
          position: 'top-right',
        });
      }

      if (dueTodayTasks.length > 0) {
        toast.success(`You have ${dueTodayTasks.length} task(s) due today. Stay focused!`, {
          duration: 5000,
          position: 'top-right',
          icon: '📅',
        });
      }
    }
  }, [tasks]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toaster />
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            DevOps & DSA Tracker
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track your 30+ day learning journey in real-time.
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {tasks.length === 0 && !loading && (
            <button
              onClick={seedDatabase}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium shadow-sm transition-colors"
            >
              Generate Schedule
            </button>
          )}
          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium shadow-sm transition-colors"
          >
            Add Custom Task
          </button>
          <div className="flex gap-3 justify-end ml-4">
            <button
              onClick={exportToCSV}
              className="px-3 py-1.5 text-sm bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-md transition-colors"
              title="Export to CSV"
            >
              CSV
            </button>
            <button
              onClick={exportToPDF}
              className="px-3 py-1.5 text-sm bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md transition-colors"
              title="Export to PDF"
            >
              PDF
            </button>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <ProgressOverview tasks={tasks} />

          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex gap-4">
              <button
                onClick={() => setActiveTab('list')}
                className={`text-sm font-medium pb-4 -mb-4 border-b-2 transition-colors ${
                  activeTab === 'list'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Task List
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`text-sm font-medium pb-4 -mb-4 border-b-2 transition-colors ${
                  activeTab === 'timeline'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Timeline View
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'list' ? (
                <TaskList
                  tasks={tasks}
                  onUpdate={fetchTasks}
                  onEdit={(task) => {
                    setEditingTask(task);
                    setIsModalOpen(true);
                  }}
                />
              ) : (
                <TimelineView tasks={tasks} />
              )}
            </div>
          </div>
        </>
      )}

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchTasks();
          }}
        />
      )}
    </div>
  );
}
