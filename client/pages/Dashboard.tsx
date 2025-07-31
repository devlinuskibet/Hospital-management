import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  UserPlus, 
  Activity, 
  Calendar,
  Pill,
  TestTube,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  Bed,
  Stethoscope
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Patients",
      value: "12,847",
      change: "+12%",
      changeType: "increase" as const,
      icon: Users,
      description: "Active patient records"
    },
    {
      title: "Today's Appointments",
      value: "156",
      change: "+8%",
      changeType: "increase" as const,
      icon: Calendar,
      description: "Scheduled for today"
    },
    {
      title: "Bed Occupancy",
      value: "87%",
      change: "-2%",
      changeType: "decrease" as const,
      icon: Bed,
      description: "267 of 307 beds occupied"
    },
    {
      title: "Revenue (Month)",
      value: "KSh 24.5M",
      change: "+15%",
      changeType: "increase" as const,
      icon: DollarSign,
      description: "Total collections this month"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "admission",
      patient: "Sarah Wanjiku",
      department: "Emergency",
      time: "5 minutes ago",
      status: "urgent"
    },
    {
      id: 2,
      type: "discharge",
      patient: "John Kamau",
      department: "Cardiology",
      time: "12 minutes ago",
      status: "completed"
    },
    {
      id: 3,
      type: "lab_result",
      patient: "Mary Akinyi",
      department: "Laboratory",
      time: "18 minutes ago",
      status: "pending"
    },
    {
      id: 4,
      type: "surgery",
      patient: "David Otieno",
      department: "Surgery",
      time: "1 hour ago",
      status: "in_progress"
    }
  ];

  const departmentMetrics = [
    { name: "Emergency", patients: 45, capacity: 60, utilization: 75 },
    { name: "Cardiology", patients: 32, capacity: 40, utilization: 80 },
    { name: "Pediatrics", patients: 28, capacity: 35, utilization: 80 },
    { name: "Surgery", patients: 18, capacity: 25, utilization: 72 },
    { name: "Maternity", patients: 22, capacity: 30, utilization: 73 }
  ];

  const alerts = [
    {
      id: 1,
      type: "critical",
      message: "ICU Bed 12 - Patient requires immediate attention",
      time: "2 minutes ago"
    },
    {
      id: 2,
      type: "warning",
      message: "Pharmacy inventory low - Paracetamol (< 100 units)",
      time: "15 minutes ago"
    },
    {
      id: 3,
      type: "info",
      message: "Lab results ready for review - 8 pending reports",
      time: "30 minutes ago"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to KUTRRH Hospital Management System
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1">
            <Activity className="h-3 w-3" />
            System Online
          </Badge>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            New Patient
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {alerts.length > 0 && (
        <Card className="border-warning-200 bg-warning-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-warning-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    alert.type === 'critical' ? 'bg-danger-500' :
                    alert.type === 'warning' ? 'bg-warning-500' :
                    'bg-medical-500'
                  }`} />
                  <span className="text-sm font-medium">{alert.message}</span>
                </div>
                <span className="text-xs text-muted-foreground">{alert.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {stat.changeType === 'increase' ? (
                  <TrendingUp className="h-3 w-3 text-success-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-danger-600" />
                )}
                <span className={stat.changeType === 'increase' ? 'text-success-600' : 'text-danger-600'}>
                  {stat.change}
                </span>
                <span>from last month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Department Utilization</CardTitle>
            <CardDescription>Current patient load by department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {departmentMetrics.map((dept) => (
              <div key={dept.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{dept.name}</span>
                  <span className="text-muted-foreground">
                    {dept.patients}/{dept.capacity} patients
                  </span>
                </div>
                <Progress value={dept.utilization} className="h-2" />
                <div className="text-right text-xs text-muted-foreground">
                  {dept.utilization}% capacity
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest patient activities and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {activity.type === 'admission' && <UserPlus className="h-4 w-4 text-medical-600" />}
                  {activity.type === 'discharge' && <CheckCircle className="h-4 w-4 text-success-600" />}
                  {activity.type === 'lab_result' && <TestTube className="h-4 w-4 text-warning-600" />}
                  {activity.type === 'surgery' && <Stethoscope className="h-4 w-4 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.patient}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.department} • {activity.time}
                  </p>
                </div>
                <Badge 
                  variant={
                    activity.status === 'urgent' ? 'destructive' :
                    activity.status === 'completed' ? 'default' :
                    activity.status === 'in_progress' ? 'secondary' :
                    'outline'
                  }
                >
                  {activity.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Commonly used functions and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <UserPlus className="h-6 w-6" />
              <span className="text-xs">New Patient</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span className="text-xs">Schedule</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <TestTube className="h-6 w-6" />
              <span className="text-xs">Lab Request</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Pill className="h-6 w-6" />
              <span className="text-xs">Prescription</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <DollarSign className="h-6 w-6" />
              <span className="text-xs">Billing</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Activity className="h-6 w-6" />
              <span className="text-xs">Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
