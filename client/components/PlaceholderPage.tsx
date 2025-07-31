import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Construction, ArrowLeft, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features?: string[];
  comingSoon?: boolean;
}

export default function PlaceholderPage({ 
  title, 
  description, 
  icon: Icon, 
  features = [],
  comingSoon = true 
}: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="h-8 border-l border-border" />
          <div>
            <div className="flex items-center gap-3">
              <Icon className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
              {comingSoon && (
                <Badge variant="secondary" className="gap-1">
                  <Construction className="h-3 w-3" />
                  Coming Soon
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Overview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon className="h-5 w-5" />
                Module Overview
              </CardTitle>
              <CardDescription>
                This module is currently under development as part of the comprehensive KUTRRH Hospital Management System.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 border-2 border-dashed border-border rounded-lg text-center space-y-4">
                <Construction className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="font-semibold text-lg">Under Development</h3>
                  <p className="text-muted-foreground">
                    This module is being built to provide comprehensive functionality for {title.toLowerCase()}.
                  </p>
                </div>
              </div>

              {features.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Planned Features:</h4>
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Development Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Design Phase</span>
                  <Badge variant="default">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Development</span>
                  <Badge variant="secondary">In Progress</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Testing</span>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Deployment</span>
                  <Badge variant="outline">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need This Module?</CardTitle>
              <CardDescription>
                Contact our development team to prioritize this module
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full gap-2">
                <MessageCircle className="h-4 w-4" />
                Request Development
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alternative Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/">Return to Dashboard</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/patients">Manage Patients</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
