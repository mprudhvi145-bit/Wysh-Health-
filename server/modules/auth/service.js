
import { prisma } from '../../lib/prisma.js';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'wysh-secure-dev-secret-key-change-in-prod';

// Helper to generate a unique readable Wysh ID
const generateWyshId = async () => {
  // Try up to 3 times to get a unique ID
  for(let attempt=0; attempt<3; attempt++) {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const id = `WYSH-IND-${result}`;
      const exists = await prisma.patient.findUnique({ where: { wyshId: id } });
      if(!exists) return id;
  }
  return `WYSH-${randomUUID().substr(0,8).toUpperCase()}`; // Fallback
};

export const AuthService = {
  async requestOtp(identifier) {
    // 1. Generate 6 digit OTP
    const code = process.env.NODE_ENV === 'production' 
        ? Math.floor(100000 + Math.random() * 900000).toString() 
        : '123456'; // Fixed OTP for dev/demo
        
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // 2. Determine User (if exists)
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] }
    });

    // 3. Store OTP
    await prisma.otp.create({
      data: {
        identifier,
        code,
        expiresAt,
        userId: user?.id // Link if user exists
      }
    });

    // 4. Send via SMS/Email Gateway (Stub)
    console.log(`[OTP-SERVICE] Generated OTP for ${identifier}: ${code}`);

    return { message: "OTP sent successfully" };
  },

  async verifyOtp(identifier, code) {
    // 1. Validate Code
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

    // 2. Mark OTP as used
    await prisma.otp.update({ where: { id: validOtp.id }, data: { used: true } });

    // 3. Find or Create User (Transactional)
    let user = await prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] },
      include: { patient: true, doctor: true }
    });

    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      const wyshId = await generateWyshId();
      const isEmail = identifier.includes('@');
      
      // Default new users to PATIENT role
      user = await prisma.user.create({
        data: {
          name: "Guest User", // Will prompt to update profile later
          email: isEmail ? identifier : undefined,
          phone: !isEmail ? identifier : undefined,
          role: "PATIENT",
          patient: {
            create: {
              wyshId: wyshId
            }
          }
        },
        include: { patient: true }
      });
    }

    // 4. Issue JWT
    const token = jwt.sign(
      { 
          id: user.id, 
          email: user.email, 
          role: user.role, 
          name: user.name,
          patientId: user.patient?.id, // Useful for frontend context
          doctorId: user.doctor?.id
      }, 
      JWT_SECRET, 
      { expiresIn: '12h' } 
    );

    return { user, token, isNewUser };
  },

  async getMe(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          avatar: true,
          abhaLinked: true,
          patient: {
              select: {
                  id: true,
                  wyshId: true,
                  bloodGroup: true
              }
          },
          doctor: {
              select: {
                  id: true,
                  specialty: true,
                  licenseNumber: true
              }
          }
      }
    });
  }
};
