import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import WorkoutPlan from '@/models/WorkoutPlan';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { fromId, toId } = await req.json();
  const userId = (session.user as any).id;

  await dbConnect();

  try {
    const sourcePlan = await WorkoutPlan.findById(fromId);
    if (!sourcePlan) return NextResponse.json({ message: 'Source plan not found' }, { status: 404 });

    const targetPlan = await WorkoutPlan.findOne({ _id: toId, userId });
    if (!targetPlan) return NextResponse.json({ message: 'Target plan not found' }, { status: 404 });

    targetPlan.days = sourcePlan.days;
    targetPlan.generalNotes = sourcePlan.generalNotes;
    await targetPlan.save();

    return NextResponse.json(targetPlan);
  } catch (err) {
    return NextResponse.json({ message: 'Error duplicating plan' }, { status: 500 });
  }
}
