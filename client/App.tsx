import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// API and Auth
import { queryClient } from "./lib/api";
import { AuthProvider, UserRole } from "./contexts/AuthContext";

// Layout and Protection
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import SimpleLogin from "./pages/SimpleLogin";
import Dashboard from "./pages/Dashboard";
import PatientRegistration from "./pages/PatientRegistration";
import Appointments from "./pages/Appointments";
import Pharmacy from "./pages/Pharmacy";
import Laboratory from "./pages/Laboratory";
import NotFound from "./pages/NotFound";

// Placeholder imports for other modules
import PlaceholderPage from "./components/PlaceholderPage";
import { Camera, DollarSign, UserCheck, Package, GraduationCap } from "lucide-react";

// Placeholder page components
const Radiology = () => (
  <PlaceholderPage
    title="Radiology Services"
    description="Medical imaging and diagnostic radiology management system"
    icon={Camera}
    features={[
      "Imaging request and scheduling",
      "DICOM/PACS integration",
      "Radiologist reporting workflow",
      "Image storage and archival",
      "Critical finding alerts",
      "Integration with patient records",
      "Imaging equipment management",
      "Radiology billing and claims",
      "Teleradiology capabilities",
      "Quality assurance protocols"
    ]}
  />
);

const Billing = () => (
  <PlaceholderPage
    title="Billing & Finance"
    description="Comprehensive billing, invoicing, and financial management system"
    icon={DollarSign}
    features={[
      "Automated service billing",
      "NHIF and insurance claims processing",
      "Invoice generation and management",
      "Payment processing and receipts",
      "Financial reporting and analytics",
      "Debt management and follow-up",
      "Multi-currency support",
      "Audit trails and compliance",
      "Revenue cycle management",
      "Integration with accounting systems"
    ]}
  />
);

const Staff = () => (
  <PlaceholderPage
    title="Human Resources"
    description="Staff management, scheduling, and human resource operations"
    icon={UserCheck}
    features={[
      "Employee records and profiles",
      "Duty roster and shift scheduling",
      "Leave management and approvals",
      "Payroll integration",
      "Performance evaluation",
      "Training and development tracking",
      "Compliance and certification management",
      "Attendance and time tracking",
      "Staff communication portal",
      "HR analytics and reporting"
    ]}
  />
);

const Inventory = () => (
  <PlaceholderPage
    title="Inventory & Procurement"
    description="Medical and non-medical supply chain management system"
    icon={Package}
    features={[
      "Medical supply inventory tracking",
      "Automated reorder points and alerts",
      "Purchase order generation",
      "Vendor management and evaluation",
      "Receiving and quality checks",
      "Asset management and tracking",
      "Cost analysis and budgeting",
      "Equipment maintenance scheduling",
      "Compliance and regulatory tracking",
      "Supply chain analytics"
    ]}
  />
);

const Research = () => (
  <PlaceholderPage
    title="Research & Academic"
    description="Clinical research, teaching, and academic program management"
    icon={GraduationCap}
    features={[
      "Clinical trial data capture",
      "Research protocol management",
      "Ethics committee workflow",
      "Student rotation scheduling",
      "Teaching hospital coordination",
      "Publication and thesis tracking",
      "Research participant management",
      "Data analysis and reporting",
      "Grant and funding management",
      "Academic collaboration tools"
    ]}
  />
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<SimpleLogin />} />

            {/* Protected routes */}
            <Route path="/*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route
                      path="/patients"
                      element={
                        <ProtectedRoute permissions={["patients.read"]}>
                          <PatientRegistration />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/appointments"
                      element={
                        <ProtectedRoute permissions={["appointments.read"]}>
                          <Appointments />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/pharmacy"
                      element={
                        <ProtectedRoute roles={[UserRole.ADMIN, UserRole.PHARMACIST, UserRole.DOCTOR]}>
                          <Pharmacy />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/laboratory"
                      element={
                        <ProtectedRoute roles={[UserRole.ADMIN, UserRole.LAB_TECH, UserRole.DOCTOR]}>
                          <Laboratory />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/radiology"
                      element={
                        <ProtectedRoute roles={[UserRole.ADMIN, UserRole.RADIOLOGIST, UserRole.DOCTOR]}>
                          <Radiology />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/billing"
                      element={
                        <ProtectedRoute permissions={["billing.read"]}>
                          <Billing />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/staff"
                      element={
                        <ProtectedRoute roles={[UserRole.ADMIN]}>
                          <Staff />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/inventory"
                      element={
                        <ProtectedRoute roles={[UserRole.ADMIN, UserRole.PHARMACIST]}>
                          <Inventory />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/research"
                      element={
                        <ProtectedRoute roles={[UserRole.ADMIN, UserRole.RESEARCHER, UserRole.DOCTOR]}>
                          <Research />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
