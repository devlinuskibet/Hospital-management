import PlaceholderPage from "@/components/PlaceholderPage";
import { TestTube } from "lucide-react";

export default function Laboratory() {
  const features = [
    "Test requisition and sample tracking",
    "Laboratory equipment integration",
    "Result reporting and validation",
    "Critical result alerts and notifications",
    "Quality control and assurance",
    "Specimen collection and labeling",
    "Reference lab coordination",
    "Laboratory billing and claims",
    "Test history and trending",
    "Laboratory analytics and reporting",
  ];

  return (
    <PlaceholderPage
      title="Laboratory Services"
      description="Comprehensive laboratory management including test processing, results, and quality control"
      icon={TestTube}
      features={features}
    />
  );
}
