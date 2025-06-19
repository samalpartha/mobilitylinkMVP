"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/shared/PageHeader";
import { VehicleTelemetry } from "@/components/vehicle/VehicleTelemetry";
import { useAuth } from "@/hooks/useAuth";
import type { VehicleTelemetryData } from "@/types";
import { UserRoles } from "@/lib/authConstants";
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

// Mock data for multiple riders for Admin/Dispatcher view
const mockAllRidersTelemetry: VehicleTelemetryData[] = [
  { id: "VEH_001", riderId: "RIDER_001", riderName: "Alex Rider", batteryPercent: 85, currentLocation: { lat: 34.0522, lng: -118.2437, address: "Downtown LA" }, speedKmh: 45, isOnline: true },
  { id: "VEH_002", riderId: "RIDER_002", riderName: "Jamie Fox", batteryPercent: 60, currentLocation: { lat: 34.0550, lng: -118.2500, address: "Echo Park" }, speedKmh: 30, isOnline: true },
  { id: "VEH_003", riderId: "RIDER_003", riderName: "Casey Shaw", batteryPercent: 15, currentLocation: { lat: 34.0600, lng: -118.2450, address: "Silver Lake" }, speedKmh: 0, isOnline: false },
  { id: "VEH_004", riderId: "RIDER_004", riderName: "Morgan Lee", batteryPercent: 95, currentLocation: { lat: 34.0400, lng: -118.2300, address: "Arts District" }, speedKmh: 65, isOnline: true },
];

export default function MapPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [telemetryData, setTelemetryData] = useState<VehicleTelemetryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Simulate fetching telemetry data
      setTimeout(() => {
        if (user.role === UserRoles.RIDER) {
          const riderData = mockAllRidersTelemetry.find(t => t.riderId === user.id || t.riderName === user.name); // Simple match
          setTelemetryData(riderData ? [riderData] : []);
        } else if (user.role === UserRoles.ADMIN) {
          setTelemetryData(mockAllRidersTelemetry);
        }
        setLoading(false);
      }, 700);
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="w-full h-[400px] md:h-[600px] rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-48 rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Live Fleet Map"
        description={user?.role === UserRoles.RIDER ? "Track your current location and vehicle status." : "Oversee all active riders and vehicle telemetry in real-time."}
      />
      
      <Card className="shadow-xl overflow-hidden" data-ai-hint="city map">
        <Image 
            src="https://placehold.co/1200x600.png" 
            alt="Placeholder map of city with rider locations" 
            width={1200} 
            height={600}
            className="w-full h-auto object-cover"
            priority
            data-ai-hint="city map"
        />
      </Card>

      {telemetryData.length > 0 && (
        <div>
          <h2 className="text-2xl font-headline font-semibold mb-4 text-foreground">
            {user?.role === UserRoles.RIDER ? "Your Vehicle Telemetry" : "Active Rider Telemetry"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {telemetryData.map(telemetry => (
              <VehicleTelemetry key={telemetry.id} telemetry={telemetry} />
            ))}
          </div>
        </div>
      )}

      {telemetryData.length === 0 && !loading && (
         <Card className="shadow-md">
            <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">No telemetry data available at the moment.</p>
            </CardContent>
         </Card>
      )}
    </div>
  );
}
