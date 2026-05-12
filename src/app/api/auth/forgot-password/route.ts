import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import nodemailer from 'nodemailer';
import rateLimit from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export async function POST(req: Request) {
  try {
    await limiter.check(3, 'CACHE_TOKEN'); // Max 3 reset requests per minute
  } catch {
    return NextResponse.json({ message: 'Quá nhiều yêu cầu. Vui lòng đợi 1 phút.' }, { status: 429 });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Không tìm thấy người dùng với email này' }, { status: 404 });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.resetCode = resetCode;
    user.resetCodeExpiry = resetCodeExpiry;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"TanGYM" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Mã xác nhận khôi phục mật khẩu - TanGYM',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
          <h2 style="color: #2563eb;">Khôi phục mật khẩu TanGYM</h2>
          <p>Xin chào ${user.name},</p>
          <p>Mã xác nhận của bạn là:</p>
          <div style="background: #eff6ff; padding: 15px; border-radius: 10px; text-align: center; font-size: 24px; font-weight: 800; color: #2563eb; letter-spacing: 5px;">
            ${resetCode}
          </div>
          <p>Mã hết hạn sau 10 phút.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">© 2026 TanGYM. Copyright HoangTan</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Mã xác nhận đã được gửi' });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Lỗi gửi mail.' }, { status: 500 });
  }
}
