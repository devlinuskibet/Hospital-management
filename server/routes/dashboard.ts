import { Router, Response } from "express";
import prisma from "../lib/db";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// Get dashboard overview statistics
router.get(
  "/stats",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

      // Get current month stats
      const [
        totalPatients,
        todayAppointments,
        monthlyRevenue,
        totalBeds,
        occupiedBeds,
        thisMonthPatients,
        lastMonthPatients,
        thisMonthAppointments,
        lastMonthAppointments,
        thisMonthRevenue,
        lastMonthRevenue,
      ] = await Promise.all([
        // Total patients
        prisma.patient.count({ where: { isActive: true } }),

        // Today's appointments
        prisma.appointment.count({
          where: {
            appointmentDate: {
              gte: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
              ),
              lt: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + 1,
              ),
            },
          },
        }),

        // Monthly revenue (sum of paid amounts in billing)
        prisma.billingRecord.aggregate({
          _sum: { paidAmount: true },
          where: {
            createdAt: { gte: startOfMonth },
          },
        }),

        // Bed statistics (mock data for now)
        Promise.resolve(307), // Total beds
        Promise.resolve(267), // Occupied beds

        // This month new patients
        prisma.patient.count({
          where: { createdAt: { gte: startOfMonth } },
        }),

        // Last month new patients
        prisma.patient.count({
          where: {
            createdAt: {
              gte: lastMonth,
              lte: endOfLastMonth,
            },
          },
        }),

        // This month appointments
        prisma.appointment.count({
          where: { createdAt: { gte: startOfMonth } },
        }),

        // Last month appointments
        prisma.appointment.count({
          where: {
            createdAt: {
              gte: lastMonth,
              lte: endOfLastMonth,
            },
          },
        }),

        // This month revenue
        prisma.billingRecord.aggregate({
          _sum: { paidAmount: true },
          where: { createdAt: { gte: startOfMonth } },
        }),

        // Last month revenue
        prisma.billingRecord.aggregate({
          _sum: { paidAmount: true },
          where: {
            createdAt: {
              gte: lastMonth,
              lte: endOfLastMonth,
            },
          },
        }),
      ]);

      // Calculate percentage changes
      const patientChange =
        lastMonthPatients > 0
          ? (
              ((thisMonthPatients - lastMonthPatients) / lastMonthPatients) *
              100
            ).toFixed(1)
          : "0";

      const appointmentChange =
        lastMonthAppointments > 0
          ? (
              ((thisMonthAppointments - lastMonthAppointments) /
                lastMonthAppointments) *
              100
            ).toFixed(1)
          : "0";

      const revenueChange =
        (lastMonthRevenue._sum.paidAmount || 0) > 0
          ? (
              (((thisMonthRevenue._sum.paidAmount || 0) -
                (lastMonthRevenue._sum.paidAmount || 0)) /
                (lastMonthRevenue._sum.paidAmount || 1)) *
              100
            ).toFixed(1)
          : "0";

      const bedOccupancy = ((occupiedBeds / totalBeds) * 100).toFixed(0);
      const bedChange = "-2"; // Mock data for bed occupancy change

      res.json({
        stats: [
          {
            title: "Total Patients",
            value: totalPatients.toLocaleString(),
            change: `${patientChange > 0 ? "+" : ""}${patientChange}%`,
            changeType:
              parseFloat(patientChange) >= 0 ? "increase" : "decrease",
            description: "Active patient records",
          },
          {
            title: "Today's Appointments",
            value: todayAppointments.toString(),
            change: `${appointmentChange > 0 ? "+" : ""}${appointmentChange}%`,
            changeType:
              parseFloat(appointmentChange) >= 0 ? "increase" : "decrease",
            description: "Scheduled for today",
          },
          {
            title: "Bed Occupancy",
            value: `${bedOccupancy}%`,
            change: `${bedChange}%`,
            changeType: "decrease",
            description: `${occupiedBeds} of ${totalBeds} beds occupied`,
          },
          {
            title: "Revenue (Month)",
            value: `KSh ${((monthlyRevenue._sum.paidAmount || 0) / 1000000).toFixed(1)}M`,
            change: `${revenueChange > 0 ? "+" : ""}${revenueChange}%`,
            changeType:
              parseFloat(revenueChange) >= 0 ? "increase" : "decrease",
            description: "Total collections this month",
          },
        ],
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Get recent activities
router.get(
  "/activities",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const [recentAppointments, recentLabResults, recentPrescriptions] =
        await Promise.all([
          prisma.appointment.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
              patient: { select: { firstName: true, lastName: true } },
              doctor: { include: { staff: true } },
            },
          }),

          prisma.labResult.findMany({
            take: 3,
            orderBy: { createdAt: "desc" },
            include: {
              patient: { select: { firstName: true, lastName: true } },
              test: { select: { name: true } },
            },
          }),

          prisma.prescription.findMany({
            take: 2,
            orderBy: { createdAt: "desc" },
            include: {
              patient: { select: { firstName: true, lastName: true } },
              doctor: { include: { staff: true } },
            },
          }),
        ]);

      const activities = [
        ...recentAppointments.map((apt) => ({
          id: apt.id,
          type: "appointment",
          patient: `${apt.patient.firstName} ${apt.patient.lastName}`,
          department: apt.doctor.staff?.department || "General",
          time: getTimeAgo(apt.createdAt),
          status: apt.status.toLowerCase(),
        })),
        ...recentLabResults.map((result) => ({
          id: result.id,
          type: "lab_result",
          patient: `${result.patient.firstName} ${result.patient.lastName}`,
          department: "Laboratory",
          time: getTimeAgo(result.createdAt),
          status: result.status.toLowerCase(),
        })),
        ...recentPrescriptions.map((prescription) => ({
          id: prescription.id,
          type: "prescription",
          patient: `${prescription.patient.firstName} ${prescription.patient.lastName}`,
          department: "Pharmacy",
          time: getTimeAgo(prescription.createdAt),
          status: prescription.status.toLowerCase(),
        })),
      ];

      // Sort by creation time and take the most recent
      activities.sort((a, b) => {
        const timeA = new Date(a.time).getTime();
        const timeB = new Date(b.time).getTime();
        return timeB - timeA;
      });

      res.json({ activities: activities.slice(0, 10) });
    } catch (error) {
      console.error("Dashboard activities error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Get department utilization
router.get(
  "/departments",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Mock department data with some real calculations
      const appointmentsToday = await prisma.appointment.groupBy({
        by: ["status"],
        where: {
          appointmentDate: {
            gte: new Date(new Date().toDateString()),
          },
        },
        _count: true,
      });

      const departments = [
        { name: "Emergency", patients: 45, capacity: 60, utilization: 75 },
        { name: "Cardiology", patients: 32, capacity: 40, utilization: 80 },
        { name: "Pediatrics", patients: 28, capacity: 35, utilization: 80 },
        { name: "Surgery", patients: 18, capacity: 25, utilization: 72 },
        { name: "Maternity", patients: 22, capacity: 30, utilization: 73 },
      ];

      res.json({ departments });
    } catch (error) {
      console.error("Department utilization error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Get critical alerts
router.get(
  "/alerts",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const alerts = [];

      // Check for critical lab results
      const criticalLabResults = await prisma.labResult.count({
        where: {
          status: "CRITICAL",
          reviewedAt: null,
        },
      });

      if (criticalLabResults > 0) {
        alerts.push({
          id: "critical-labs",
          type: "critical",
          message: `${criticalLabResults} critical lab result${criticalLabResults > 1 ? "s" : ""} requiring immediate attention`,
          time: "Just now",
        });
      }

      // Check for low drug inventory
      const lowStockDrugs = await prisma.drug.count({
        where: {
          stockQuantity: { lte: prisma.drug.fields.reorderLevel },
        },
      });

      if (lowStockDrugs > 0) {
        alerts.push({
          id: "low-stock",
          type: "warning",
          message: `${lowStockDrugs} drug${lowStockDrugs > 1 ? "s" : ""} below reorder level`,
          time: "15 minutes ago",
        });
      }

      // Check for pending lab results
      const pendingLabResults = await prisma.labResult.count({
        where: {
          status: "PENDING",
          createdAt: {
            lte: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          },
        },
      });

      if (pendingLabResults > 0) {
        alerts.push({
          id: "pending-labs",
          type: "info",
          message: `${pendingLabResults} lab result${pendingLabResults > 1 ? "s" : ""} ready for review`,
          time: "30 minutes ago",
        });
      }

      res.json({ alerts });
    } catch (error) {
      console.error("Dashboard alerts error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Helper function to calculate time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default router;
