import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import WorkoutPlan from '@/models/WorkoutPlan';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const planId = searchParams.get('planId');
  const userId = (session.user as any).id;

  if (!planId) return NextResponse.json({ message: 'Missing planId' }, { status: 400 });

  await dbConnect();

  try {
    const sourcePlan = await WorkoutPlan.findById(planId);
    if (!sourcePlan) return NextResponse.json({ message: 'Plan not found' }, { status: 404 });

    const newPlan = new WorkoutPlan({
      userId,
      title: `${sourcePlan.title} (Imported)`,
      generalNotes: sourcePlan.generalNotes || '',
      days: sourcePlan.days
    });

    await newPlan.save();
    return NextResponse.json(newPlan);
  } catch (err) {
    return NextResponse.json({ message: 'Invalid ID or error importing plan' }, { status: 500 });
  }
}
