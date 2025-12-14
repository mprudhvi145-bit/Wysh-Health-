
import { prisma } from '../../lib/prisma.js';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'wysh-secure-dev-secret-key-change-in-prod';

const generateWyshId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `WYSH-IND-${result}`;
};

export const AuthService = {
  async requestOtp(identifier) {
    // Generate 6 digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // In production, integrate with SMS Gateway (Twilio/Gupshup)
    console.log(`[OTP-SERVICE] Generated OTP for ${identifier}: ${code}`);

    await prisma.otp.create({
      data: {
        identifier,
        code,
        expiresAt
      }
    });

    return { message: "OTP sent successfully" };
  },

  async verifyOtp(identifier, code) {
    const validOtp = await prisma.otp.findFirst({
      where: {
        identifier,
        code,
        used: false,
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!validOtp) throw new Error("Invalid or expired OTP");

    // Mark used
    await prisma.otp.update({ where: { id: validOtp.id }, data: { used: true } });

    // Find or Create User
    let user = await prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] }
    });

    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      // Create Patient by default
      const wyshId = generateWyshId();
      
      // Determine if identifier is email or phone
      const isEmail = identifier.includes('@');
      
      user = await prisma.user.create({
        data: {
          name: "Guest User",
          email: isEmail ? identifier : undefined,
          phone: !isEmail ? identifier : undefined,
          role: "patient",
          patient: {
            create: {
              wyshId: wyshId
            }
          }
        },
        include: { patient: true }
      });
    }

    // Security Hardening: Short-lived tokens (15 mins)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name }, 
      JWT_SECRET, 
      { expiresIn: '15m' } 
    );

    return { user, token, isNewUser };
  },

  async getMe(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: { 
        patient: { select: { wyshId: true } }, 
        doctor: { select: { specialty: true } } 
      }
    });
  }
};
