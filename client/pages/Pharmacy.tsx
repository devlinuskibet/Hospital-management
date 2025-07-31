import PlaceholderPage from "@/components/PlaceholderPage";
import { Pill } from "lucide-react";

export default function Pharmacy() {
  const features = [
    "Drug inventory management and tracking",
    "Prescription processing and dispensing",
    "Integration with doctor prescriptions",
    "NHIF claims processing for medications",
    "Drug interaction and allergy checking",
    "Automated reorder alerts and procurement",
    "Batch tracking and expiry management",
    "Patient medication history",
    "Pharmacy billing and invoicing",
    "Drug utilization reporting"
  ];

  return (
    <PlaceholderPage
      title="Pharmacy Management"
      description="Complete pharmacy operations including inventory, dispensing, and prescription management"
      icon={Pill}
      features={features}
    />
  );
}
