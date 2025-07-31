import { Router, Request, Response } from 'express';
import prisma from '../lib/db';
import { authenticateToken, authorizeRoles, AuthenticatedRequest } from '../middleware/auth';
import { validatePatientRegistration, handleValidationErrors } from '../middleware/validation';
import { UserRole } from '@prisma/client';

const router = Router();

// Get all patients (with pagination and search)
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { patientNumber: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { nationalId: { contains: search } }
      ];
    }

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          patientNumber: true,
          firstName: true,
          lastName: true,
          middleName: true,
          dateOfBirth: true,
          gender: true,
          phone: true,
          email: true,
          county: true,
          nhifNumber: true,
          createdAt: true
        }
      }),
      prisma.patient.count({ where })
    ]);

    res.json({
      patients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get patient by ID
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: req.params.id },
      include: {
        appointments: {
          orderBy: { appointmentDate: 'desc' },
          take: 10,
          include: {
            doctor: {
              include: { staff: true }
            }
          }
        },
        prescriptions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            doctor: {
              include: { staff: true }
            },
            items: {
              include: { drug: true }
            }
          }
        },
        labResults: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            test: true,
            reviewer: {
              include: { staff: true }
            }
          }
        },
        patientVisits: {
          orderBy: { visitDate: 'desc' },
          take: 10
        }
      }
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({ patient });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register new patient
router.post('/', authenticateToken, authorizeRoles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.NURSE), validatePatientRegistration, handleValidationErrors, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const patientData = req.body;

    // Check if patient with same national ID exists
    const existingPatient = await prisma.patient.findUnique({
      where: { nationalId: patientData.nationalId }
    });

    if (existingPatient) {
      return res.status(400).json({ error: 'Patient with this National ID already exists' });
    }

    // Generate patient number
    const patientCount = await prisma.patient.count();
    const patientNumber = `P${(patientCount + 1).toString().padStart(6, '0')}`;

    const patient = await prisma.patient.create({
      data: {
        ...patientData,
        patientNumber,
        dateOfBirth: new Date(patientData.dateOfBirth)
      }
    });

    res.status(201).json({
      message: 'Patient registered successfully',
      patient
    });
  } catch (error) {
    console.error('Patient registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update patient
router.put('/:id', authenticateToken, authorizeRoles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.NURSE), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData.id;
    delete updateData.patientNumber;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        ...updateData,
        ...(updateData.dateOfBirth && { dateOfBirth: new Date(updateData.dateOfBirth) })
      }
    });

    res.json({
      message: 'Patient updated successfully',
      patient
    });
  } catch (error) {
    console.error('Patient update error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search patients by various criteria
router.get('/search/:query', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const query = req.params.query;
    
    const patients = await prisma.patient.findMany({
      where: {
        isActive: true,
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { patientNumber: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query } },
          { nationalId: { contains: query } },
          { nhifNumber: { contains: query } }
        ]
      },
      select: {
        id: true,
        patientNumber: true,
        firstName: true,
        lastName: true,
        middleName: true,
        phone: true,
        dateOfBirth: true,
        gender: true
      },
      take: 20
    });

    res.json({ patients });
  } catch (error) {
    console.error('Patient search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get patient statistics
router.get('/stats/overview', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [
      totalPatients,
      newPatientsThisMonth,
      activePatients,
      patientsWithNHIF
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.patient.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      prisma.patient.count({ where: { isActive: true } }),
      prisma.patient.count({
        where: {
          nhifNumber: { not: null },
          isActive: true
        }
      })
    ]);

    res.json({
      totalPatients,
      newPatientsThisMonth,
      activePatients,
      patientsWithNHIF,
      nhifCoverage: totalPatients > 0 ? ((patientsWithNHIF / totalPatients) * 100).toFixed(1) : 0
    });
  } catch (error) {
    console.error('Patient stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
