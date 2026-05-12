import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import WorkoutPlan from '@/models/WorkoutPlan';
import rateLimit from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 1000,
});

function getClientIp(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0] : '127.0.0.1';
}

export async function GET(req: Request) {
  const ip = getClientIp(req);
  try {
    await limiter.check(40, ip); // 40 req/min per IP
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 429 });
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    await WorkoutPlan.collection.dropIndex('userId_1');
  } catch (e) {}

  const plans = await WorkoutPlan.find({ userId: (session.user as any).id }).sort({ createdAt: -1 });
  return NextResponse.json(plans);
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  try {
    await limiter.check(25, ip); // 25 updates/min per IP
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 429 });
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { planId, title, dayOfWeek, exercises, sessionName } = await req.json();
  const userId = (session.user as any).id;

  await dbConnect();

  let plan;
  if (planId) {
    plan = await WorkoutPlan.findOne({ _id: planId, userId });
  } else if (title && !dayOfWeek) {
    plan = new WorkoutPlan({ userId, title, days: [] });
    await plan.save();
    return NextResponse.json(plan);
  }

  if (!plan && !planId) {
    plan = new WorkoutPlan({
      userId,
      title: title || 'Lịch tập của tôi',
      days: dayOfWeek ? [{ dayOfWeek, exercises, sessionName }] : []
    });
  } else if (plan && dayOfWeek) {
    const dayIndex = plan.days.findIndex((d: any) => d.dayOfWeek === dayOfWeek);
    if (dayIndex > -1) {
      plan.days[dayIndex] = { dayOfWeek, exercises, sessionName };
    } else {
      plan.days.push({ dayOfWeek, exercises, sessionName });
    }
  } else if (plan && title) {
    plan.title = title;
  }

  await plan.save();
  return NextResponse.json(plan);
}

export async function DELETE(req: Request) {
  const ip = getClientIp(req);
  try {
    await limiter.check(10, ip);
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 429 });
  }

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const planId = searchParams.get('planId');
  const deleteAllExcept = searchParams.get('deleteAllExcept');

  await dbConnect();

  if (deleteAllExcept === 'true' && planId) {
    await WorkoutPlan.deleteMany({ _id: { $ne: planId }, userId: (session.user as any).id });
    return NextResponse.json({ message: 'All other plans deleted' });
  }

  if (!planId) return NextResponse.json({ message: 'Missing planId' }, { status: 400 });

  await WorkoutPlan.deleteOne({ _id: planId, userId: (session.user as any).id });
  return NextResponse.json({ message: 'Deleted' });
}
