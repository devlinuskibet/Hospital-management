import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
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
  Stethoscope,
  RefreshCw
} from "lucide-react";

export default function Dashboard() {
  // Fetch dashboard data using React Query
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => api.dashboard.stats(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const {
    data: activitiesData,
    isLoading: activitiesLoading
  } = useQuery({
    queryKey: ['dashboard', 'activities'],
    queryFn: () => api.dashboard.activities(),
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const {
    data: departmentsData,
    isLoading: departmentsLoading
  } = useQuery({
    queryKey: ['dashboard', 'departments'],
    queryFn: () => api.dashboard.departments(),
    refetchInterval: 60000, // Refetch every minute
  });

  const {
    data: alertsData,
    isLoading: alertsLoading
  } = useQuery({
    queryKey: ['dashboard', 'alerts'],
    queryFn: () => api.dashboard.alerts(),
    refetchInterval: 5000, // Refetch every 5 seconds for critical alerts
  });

  const stats = statsData?.stats || [];
  const activities = activitiesData?.activities || [];
  const departments = departmentsData?.departments || [];
  const alerts = alertsData?.alerts || [];

  const StatCard = ({ stat, icon: Icon }: { stat: any; icon: any }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
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
  );

  const getIconForStat = (title: string) => {
    if (title.includes('Patient')) return Users;
    if (title.includes('Appointment')) return Calendar;
    if (title.includes('Bed')) return Bed;
    if (title.includes('Revenue')) return DollarSign;
    return Activity;
  };

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchStats()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error State */}
      {statsError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      )}

      {/* Critical Alerts */}
      {alertsLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : alerts.length > 0 && (
        <Card className="border-warning-200 bg-warning-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-warning-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Critical Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert: any) => (
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
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-40" />
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat: any) => (
            <StatCard
              key={stat.title}
              stat={stat}
              icon={getIconForStat(stat.title)}
            />
          ))
        )}
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
