import { Router, Response } from 'express';
import prisma from '../lib/db';
import { authenticateToken, authorizeRoles, AuthenticatedRequest } from '../middleware/auth';
import { validateAppointment, handleValidationErrors } from '../middleware/validation';
import { UserRole } from '@prisma/client';

const router = Router();

// Get all appointments (with pagination and filtering)
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const doctorId = req.query.doctorId as string;
    const patientId = req.query.patientId as string;
    const date = req.query.date as string;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) where.status = status;
    if (doctorId) where.doctorId = doctorId;
    if (patientId) where.patientId = patientId;
    if (date) {
      const appointmentDate = new Date(date);
      where.appointmentDate = {
        gte: new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate()),
        lt: new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate() + 1)
      };
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { appointmentDate: 'asc' },
          { appointmentTime: 'asc' }
        ],
        include: {
          patient: {
            select: {
              id: true,
              patientNumber: true,
              firstName: true,
              lastName: true,
              phone: true,
              dateOfBirth: true
            }
          },
          doctor: {
            include: {
              staff: {
                select: {
                  firstName: true,
                  lastName: true,
                  department: true,
                  specialization: true
                }
              }
            }
          }
        }
      }),
      prisma.appointment.count({ where })
    ]);

    res.json({
      appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get appointment by ID
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: {
        patient: true,
        doctor: {
          include: { staff: true }
        },
        createdByUser: {
          include: { staff: true }
        }
      }
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ appointment });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new appointment
router.post('/', authenticateToken, authorizeRoles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST), validateAppointment, handleValidationErrors, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { patientId, doctorId, appointmentDate, appointmentTime, duration, type, notes } = req.body;

    // Check if patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    });
    if (!patient) {
      return res.status(400).json({ error: 'Patient not found' });
    }

    // Check if doctor exists and is available
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId, role: UserRole.DOCTOR }
    });
    if (!doctor) {
      return res.status(400).json({ error: 'Doctor not found' });
    }

    // Check for conflicting appointments
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    const endTime = new Date(appointmentDateTime.getTime() + (duration || 30) * 60000);

    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate: new Date(appointmentDate),
        status: { in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'] },
        OR: [
          {
            appointmentTime: appointmentTime
          }
        ]
      }
    });

    if (conflictingAppointment) {
      return res.status(400).json({ error: 'Doctor is not available at this time' });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        createdBy: req.user!.userId,
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        duration: duration || 30,
        type,
        notes
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            patientNumber: true
          }
        },
        doctor: {
          include: { staff: true }
        }
      }
    });

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update appointment
router.put('/:id', authenticateToken, authorizeRoles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.createdBy;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...updateData,
        ...(updateData.appointmentDate && { appointmentDate: new Date(updateData.appointmentDate) })
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            patientNumber: true
          }
        },
        doctor: {
          include: { staff: true }
        }
      }
    });

    res.json({
      message: 'Appointment updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel appointment
router.patch('/:id/cancel', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        notes: reason ? `Cancelled: ${reason}` : 'Cancelled'
      }
    });

    res.json({
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available time slots for a doctor on a specific date
router.get('/availability/:doctorId/:date', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { doctorId, date } = req.params;

    // Get existing appointments for the doctor on the specified date
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: new Date(date),
        status: { in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'] }
      },
      select: {
        appointmentTime: true,
        duration: true
      }
    });

    // Generate available time slots (9 AM to 5 PM, 30-minute intervals)
    const availableSlots = [];
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Check if this slot conflicts with existing appointments
        const isConflict = existingAppointments.some(apt => {
          return apt.appointmentTime === timeSlot;
        });

        if (!isConflict) {
          availableSlots.push(timeSlot);
        }
      }
    }

    res.json({ availableSlots });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get appointments statistics
router.get('/stats/overview', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [
      todayAppointments,
      weekAppointments,
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      pendingAppointments
    ] = await Promise.all([
      prisma.appointment.count({
        where: {
          appointmentDate: {
            gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
          }
        }
      }),
      prisma.appointment.count({
        where: {
          appointmentDate: {
            gte: startOfWeek,
            lt: endOfWeek
          }
        }
      }),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: 'COMPLETED' } }),
      prisma.appointment.count({ where: { status: 'CANCELLED' } }),
      prisma.appointment.count({ where: { status: { in: ['SCHEDULED', 'CONFIRMED'] } } })
    ]);

    res.json({
      todayAppointments,
      weekAppointments,
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      pendingAppointments,
      completionRate: totalAppointments > 0 ? ((completedAppointments / totalAppointments) * 100).toFixed(1) : '0'
    });
  } catch (error) {
    console.error('Appointment stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
