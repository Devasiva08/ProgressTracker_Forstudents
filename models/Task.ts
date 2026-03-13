import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  category: string;
  scheduleLabel: string; // e.g., 'Week 1', 'Next 3 days'
  color: string;
  startDate: Date;
  endDate: Date;
  status: 'Not Started' | 'In Progress' | 'Completed';
  progress: number;
  order: number;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    scheduleLabel: { type: String, required: true },
    color: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started',
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
