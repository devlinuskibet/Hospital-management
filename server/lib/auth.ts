import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'kutrrh-hospital-secret-key-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  staffId?: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};

export const generateStaffId = (role: UserRole, department?: string): string => {
  const rolePrefix = {
    ADMIN: 'ADM',
    DOCTOR: 'DOC',
    NURSE: 'NUR',
    RECEPTIONIST: 'REC',
    PHARMACIST: 'PHR',
    LAB_TECH: 'LAB',
    RADIOLOGIST: 'RAD',
    FINANCE: 'FIN',
    RESEARCHER: 'RES'
  };
  
  const deptPrefix = department ? department.substring(0, 3).toUpperCase() : 'GEN';
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  
  return `${rolePrefix[role]}${deptPrefix}${randomNumber}`;
};
