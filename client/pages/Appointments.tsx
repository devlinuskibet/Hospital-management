import PlaceholderPage from "@/components/PlaceholderPage";
import { Calendar } from "lucide-react";

export default function Appointments() {
  const features = [
    "Online appointment booking system",
    "Doctor availability management",
    "Automated appointment reminders via SMS/Email",
    "Appointment rescheduling and cancellation",
    "Queue management and triage",
    "Integration with patient records",
    "Consultation workflow management",
    "Follow-up appointment scheduling",
    "Multi-department appointment coordination",
    "Real-time appointment status updates",
  ];

  return (
    <PlaceholderPage
      title="Appointments"
      description="Comprehensive appointment scheduling and management system for outpatient and inpatient services"
      icon={Calendar}
      features={features}
    />
  );
}
