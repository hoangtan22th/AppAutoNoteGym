import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ 
      email,
      resetCode: code,
      resetCodeExpiry: { $gt: Date.now() }
    }).select('+resetCode +resetCodeExpiry');

    if (!user) {
      return NextResponse.json({ message: 'Mã xác nhận không chính xác hoặc đã hết hạn' }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user
    user.password = hashedPassword;
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: 'Mật khẩu đã được cập nhật thành công' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
