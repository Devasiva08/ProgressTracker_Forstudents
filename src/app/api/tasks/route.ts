import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';

export async function GET() {
  try {
    await dbConnect();
    const tasks = await Task.find({}).sort({ order: 1 });
    return NextResponse.json({ success: true, data: tasks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Assign order based on highest existing order + 1
    const highestTask = await Task.findOne().sort('-order');
    body.order = highestTask ? highestTask.order + 1 : 1;

    const task = await Task.create(body);
    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
