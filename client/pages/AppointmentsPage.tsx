import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  UserPlus,
  Search,
  Filter,
  Plus,
  Edit,
  X,
  CheckCircle,
  AlertCircle,
  Phone,
  Stethoscope
} from 'lucide-react';

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  
  const queryClient = useQueryClient();

  // Fetch appointments
  const { 
    data: appointmentsData, 
    isLoading: appointmentsLoading,
    error: appointmentsError 
  } = useQuery({
    queryKey: ['appointments', { 
      page: 1, 
      date: format(selectedDate, 'yyyy-MM-dd'),
      search: searchQuery,
      status: statusFilter 
    }],
    queryFn: () => api.appointments.list({
      page: 1,
      limit: 20,
      date: format(selectedDate, 'yyyy-MM-dd'),
      ...(searchQuery && { search: searchQuery }),
      ...(statusFilter && { status: statusFilter })
    }),
  });

  // Fetch appointment statistics
  const { data: statsData } = useQuery({
    queryKey: ['appointments', 'stats'],
    queryFn: () => api.appointments.stats(),
  });

  // Fetch doctors for appointment creation
  const { data: doctorsData } = useQuery({
    queryKey: ['staff', 'doctors'],
    queryFn: () => api.staff.doctors(),
  });

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: (data: any) => api.appointments.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setIsNewAppointmentOpen(false);
      toast.success('Appointment created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create appointment');
    }
  });

  // Update appointment mutation
  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => api.appointments.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setEditingAppointment(null);
      toast.success('Appointment updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update appointment');
    }
  });

  // Cancel appointment mutation
  const cancelAppointmentMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => 
      api.appointments.cancel(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Appointment cancelled');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel appointment');
    }
  });

  const appointments = appointmentsData?.appointments || [];
  const stats = statsData || {};
  const doctors = doctorsData?.doctors || [];

  const getStatusBadge = (status: string) => {
    const variants = {
      SCHEDULED: 'default',
      CONFIRMED: 'secondary',
      IN_PROGRESS: 'outline',
      COMPLETED: 'default',
      CANCELLED: 'destructive',
      NO_SHOW: 'destructive'
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-success-600" />;
      case 'CANCELLED':
      case 'NO_SHOW':
        return <X className="h-4 w-4 text-danger-600" />;
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-warning-600" />;
      default:
        return <CalendarIcon className="h-4 w-4 text-medical-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground">
            Manage patient appointments and scheduling
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="gap-2" onClick={() => setIsNewAppointmentOpen(true)}>
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Error State */}
      {appointmentsError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load appointments. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAppointments || 0}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weekAppointments || 0}</div>
            <p className="text-xs text-muted-foreground">Total this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAppointments || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">Appointments completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Patients</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by patient name or number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex-1">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments for {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
          <CardDescription>
            {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {appointmentsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No appointments found</h3>
              <p className="text-muted-foreground">
                No appointments scheduled for this date and filter criteria.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment: any) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(appointment.status)}
                        {appointment.appointmentTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {appointment.patient.firstName} {appointment.patient.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {appointment.patient.patientNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          Dr. {appointment.doctor.staff?.firstName} {appointment.doctor.staff?.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {appointment.doctor.staff?.department}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {appointment.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(appointment.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingAppointment(appointment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => cancelAppointmentMutation.mutate({ 
                              id: appointment.id,
                              reason: 'Cancelled by staff' 
                            })}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* New Appointment Dialog - This would contain the appointment creation form */}
      <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>
              Create a new appointment for a patient
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Appointment creation form would be implemented here with patient selection,
              doctor selection, date/time picker, and appointment type.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewAppointmentOpen(false)}>
              Cancel
            </Button>
            <Button>Create Appointment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
