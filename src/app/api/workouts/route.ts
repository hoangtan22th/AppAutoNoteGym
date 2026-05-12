import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import WorkoutPlan from '@/models/WorkoutPlan';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const workoutPlan = await WorkoutPlan.findOne({ userId: (session.user as any).id });
  
  // Return empty array if no plan exists yet, frontend will handle it
  return NextResponse.json(workoutPlan?.days || []);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { dayOfWeek, exercises, sessionName } = await req.json();
  const userId = (session.user as any).id;

  await dbConnect();

  // Find the plan or create a new one
  let plan = await WorkoutPlan.findOne({ userId });

  if (!plan) {
    plan = new WorkoutPlan({
      userId,
      days: [
        { dayOfWeek, exercises, sessionName }
      ]
    });
  } else {
    // Check if day already exists in the array
    const dayIndex = plan.days.findIndex((d: any) => d.dayOfWeek === dayOfWeek);
    if (dayIndex > -1) {
      plan.days[dayIndex] = { dayOfWeek, exercises, sessionName };
    } else {
      plan.days.push({ dayOfWeek, exercises, sessionName });
    }
  }

  await plan.save();

  return NextResponse.json(plan.days);
}
