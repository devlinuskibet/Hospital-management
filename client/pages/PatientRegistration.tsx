import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  Users,
  IdCard,
  Heart,
  Shield,
  MapPin,
  Phone,
  Mail,
  User,
  Save,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Search,
} from "lucide-react";
import { format } from "date-fns";

export default function PatientRegistration() {
  const [date, setDate] = useState<Date>();
  const [nhifVerified, setNhifVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Patient registered successfully!");
    }, 2000);
  };

  const handleNhifVerification = () => {
    setNhifVerified(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Patient Registration
          </h1>
          <p className="text-muted-foreground">
            Register new patients and manage their information
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            Search Existing
          </Button>
          <Badge variant="outline" className="gap-1">
            <Users className="h-3 w-3" />
            12,847 Total Patients
          </Badge>
        </div>
      </div>

      {/* Patient Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Existing Patient
          </CardTitle>
          <CardDescription>
            Check if patient is already registered before creating new record
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Search by name, ID number, or phone..."
              className="flex-1"
            />
            <Button className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Registration Form */}
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal" className="gap-2">
              <User className="h-4 w-4" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2">
              <MapPin className="h-4 w-4" />
              Contact Details
            </TabsTrigger>
            <TabsTrigger value="insurance" className="gap-2">
              <Shield className="h-4 w-4" />
              Insurance
            </TabsTrigger>
            <TabsTrigger value="medical" className="gap-2">
              <Heart className="h-4 w-4" />
              Medical Info
            </TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Basic demographic and identification details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input id="middleName" placeholder="Enter middle name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">National ID Number *</Label>
                    <Input
                      id="idNumber"
                      placeholder="Enter ID number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input id="occupation" placeholder="Enter occupation" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Details */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Communication and address details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+254 700 000 000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="patient@example.com"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Physical Address
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="county">County *</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select county" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nairobi">Nairobi</SelectItem>
                          <SelectItem value="mombasa">Mombasa</SelectItem>
                          <SelectItem value="kiambu">Kiambu</SelectItem>
                          <SelectItem value="nakuru">Nakuru</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subCounty">Sub-County</Label>
                      <Input id="subCounty" placeholder="Enter sub-county" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Physical Address</Label>
                    <Textarea id="address" placeholder="Enter full address" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Emergency Contact
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName">Contact Name *</Label>
                      <Input
                        id="emergencyName"
                        placeholder="Enter contact name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyRelation">Relationship</Label>
                      <Input
                        id="emergencyRelation"
                        placeholder="e.g., Spouse, Parent"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Phone Number *</Label>
                      <Input
                        id="emergencyPhone"
                        type="tel"
                        placeholder="+254 700 000 000"
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insurance Information */}
          <TabsContent value="insurance">
            <Card>
              <CardHeader>
                <CardTitle>Insurance Information</CardTitle>
                <CardDescription>
                  NHIF and private insurance details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    NHIF Details
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nhifNumber">NHIF Number</Label>
                      <div className="flex gap-2">
                        <Input
                          id="nhifNumber"
                          placeholder="Enter NHIF number"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleNhifVerification}
                          className="gap-2"
                        >
                          {nhifVerified ? (
                            <CheckCircle className="h-4 w-4 text-success-600" />
                          ) : (
                            <Shield className="h-4 w-4" />
                          )}
                          Verify
                        </Button>
                      </div>
                      {nhifVerified && (
                        <div className="flex items-center gap-2 text-sm text-success-600">
                          <CheckCircle className="h-4 w-4" />
                          NHIF number verified
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nhifStatus">NHIF Status</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Private Insurance
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="hasInsurance" />
                    <Label htmlFor="hasInsurance">
                      Patient has private insurance
                    </Label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="insuranceProvider">
                        Insurance Provider
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aap">AAP Insurance</SelectItem>
                          <SelectItem value="britam">Britam</SelectItem>
                          <SelectItem value="madison">
                            Madison Insurance
                          </SelectItem>
                          <SelectItem value="aar">AAR Insurance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policyNumber">Policy Number</Label>
                      <Input
                        id="policyNumber"
                        placeholder="Enter policy number"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical Information */}
          <TabsContent value="medical">
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
                <CardDescription>
                  Medical history and initial assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a+">A+</SelectItem>
                        <SelectItem value="a-">A-</SelectItem>
                        <SelectItem value="b+">B+</SelectItem>
                        <SelectItem value="b-">B-</SelectItem>
                        <SelectItem value="ab+">AB+</SelectItem>
                        <SelectItem value="ab-">AB-</SelectItem>
                        <SelectItem value="o+">O+</SelectItem>
                        <SelectItem value="o-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Enter weight"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="Enter height"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Known Allergies</Label>
                  <Textarea
                    id="allergies"
                    placeholder="List any known allergies (drugs, food, environmental, etc.)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conditions">
                    Existing Medical Conditions
                  </Label>
                  <Textarea
                    id="conditions"
                    placeholder="List any existing medical conditions or chronic diseases"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea
                    id="medications"
                    placeholder="List current medications and dosages"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visitReason">Reason for Visit</Label>
                  <Textarea
                    id="visitReason"
                    placeholder="Describe the reason for this visit"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              * Required fields must be completed
            </div>
            <div className="flex gap-4">
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Register Patient
                  </>
                )}
              </Button>
            </div>
          </div>
        </Tabs>
      </form>
    </div>
  );
}
