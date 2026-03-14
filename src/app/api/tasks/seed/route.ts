import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task, { ITask } from '@/models/Task';
import { addDays, startOfDay } from 'date-fns';

export async function POST() {
  try {
    await dbConnect();

    // Check if tasks already exist to prevent duplicate seeds
    const count = await Task.countDocuments();
    if (count > 0) {
      return NextResponse.json(
        { success: false, message: 'Database already contains tasks. Clear it first if you want to re-seed.' },
        { status: 400 }
      );
    }

    const tomorrow = startOfDay(addDays(new Date(), 1));

    interface SeedTask {
      title: string;
      category: string;
      scheduleLabel: string;
      color: string;
      durationDays: number;
    }

    const schedulePlan: SeedTask[] = [
      {
        title: 'DSA concepts + Git + Jenkins + GitHub Actions',
        category: 'Foundations & CI',
        scheduleLabel: 'Week 1',
        color: 'bg-blue-100 dark:bg-blue-900 border-blue-500',
        durationDays: 7,
      },
      {
        title: 'Ansible',
        category: 'Config Management',
        scheduleLabel: 'Week 2',
        color: 'bg-green-100 dark:bg-green-900 border-green-500',
        durationDays: 7,
      },
      {
        title: 'Terraform',
        category: 'Infrastructure as Code',
        scheduleLabel: 'Week 3',
        color: 'bg-yellow-100 dark:bg-yellow-900 border-yellow-500',
        durationDays: 7,
      },
      {
        title: 'Docker',
        category: 'Containerization',
        scheduleLabel: 'Next 3 Days (Week 4 Part 1)',
        color: 'bg-purple-100 dark:bg-purple-900 border-purple-500',
        durationDays: 3,
      },
      {
        title: 'Kubernetes',
        category: 'Container Orchestration',
        scheduleLabel: 'Week 5',
        color: 'bg-orange-100 dark:bg-orange-900 border-orange-500',
        durationDays: 7,
      },
      {
        title: 'Prometheus + Grafana',
        category: 'Monitoring',
        scheduleLabel: 'Week 6',
        color: 'bg-red-100 dark:bg-red-900 border-red-500',
        durationDays: 7,
      },
      {
        title: 'Splunk',
        category: 'Logging & Monitoring',
        scheduleLabel: 'Next 2 Days',
        color: 'bg-pink-100 dark:bg-pink-900 border-pink-500',
        durationDays: 2,
      },
      {
        title: 'CI/CD and End-to-End Project',
        category: 'Project',
        scheduleLabel: 'Final Week',
        color: 'bg-teal-100 dark:bg-teal-900 border-teal-500',
        durationDays: 7,
      },
    ];

    let currentDate = tomorrow;
    const tasksToInsert: Partial<ITask>[] = [];

    schedulePlan.forEach((plan, index) => {
      const endDate = addDays(currentDate, plan.durationDays);
      
      tasksToInsert.push({
        title: plan.title,
        category: plan.category,
        scheduleLabel: plan.scheduleLabel,
        color: plan.color,
        startDate: currentDate,
        endDate: endDate,
        status: 'Not Started',
        progress: 0,
        order: index + 1,
      });

      // Advance currentDate to start the day after this task ends
      currentDate = endDate;
    });

    const tasks = await Task.insertMany(tasksToInsert);

    return NextResponse.json({ success: true, data: tasks }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
