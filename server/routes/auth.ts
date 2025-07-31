import { Router, Request, Response } from 'express';
import { hashPassword, comparePassword, generateToken, generateStaffId } from '../lib/auth';
import prisma from '../lib/db';
import { validateLogin, validateStaffRegistration, handleValidationErrors } from '../middleware/validation';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Login
router.post('/login', validateLogin, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { staff: true }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      staffId: user.staffId || undefined
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        staffId: user.staffId,
        staff: user.staff
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register Staff
router.post('/register-staff', validateStaffRegistration, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, middleName, email, phone, department, position, role, specialization, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await hashPassword(password || 'kutrrh123'); // Default password
    const staffId = generateStaffId(role, department);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        staffId,
        staff: {
          create: {
            staffId,
            firstName,
            lastName,
            middleName,
            phone,
            email,
            department,
            position,
            specialization,
            hireDate: new Date()
          }
        }
      },
      include: { staff: true }
    });

    res.status(201).json({
      message: 'Staff registered successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        staffId: user.staffId,
        staff: user.staff
      }
    });
  } catch (error) {
    console.error('Staff registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: { staff: true },
      select: {
        id: true,
        email: true,
        role: true,
        staffId: true,
        isActive: true,
        createdAt: true,
        staff: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedNewPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { password: hashedNewPassword }
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
