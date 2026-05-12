import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Workout from '@/models/Workout';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  // For simplicity, we'll just get all workouts for this user
  // In a real app, you'd filter by current week
  const workouts = await Workout.find({ userId: (session.user as any).id });

  return NextResponse.json(workouts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { dayOfWeek, exercises, date, sessionName } = await req.json();

  await dbConnect();

  const workout = await Workout.findOneAndUpdate(
    { userId: (session.user as any).id, dayOfWeek },
    { exercises, date: date || new Date(), sessionName },
    { upsert: true, new: true }
  );

  return NextResponse.json(workout);
}
