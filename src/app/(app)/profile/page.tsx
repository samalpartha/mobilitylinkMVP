"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/shared/PageHeader";
import { RiderProfileDisplay } from "@/components/rider/RiderProfileDisplay";
import { PunchClock } from "@/components/rider/PunchClock";
import { useAuth } from "@/hooks/useAuth";
import type { RiderProfileData } from "@/types";
import { UserRoles } from '@/lib/authConstants';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data - in a real app, this would come from an API
const mockRiderProfiles: Record<string, RiderProfileData> = {
  "rider@example.com": {
    id: "RIDER_001",
    name: "Alex Rider",
    email: "rider@example.com",
    phone: "+1 (555) 123-4567",
    vehicleType: "Bike",
    backgroundCheckStatus: "Approved",
    punchStatus: "Punched Out",
    lastPunchTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
  },
   "admin@example.com": { // So admin can also see a profile view
    id: "ADMIN_001",
    name: "Chris Admin",
    email: "admin@example.com",
    phone: "+1 (555) 987-6543",
    vehicleType: "Car",
    backgroundCheckStatus: "Approved",
    punchStatus: "Punched Out", // Admins don't typically punch in/out
  },
   "client@example.com": { 
    id: "CLIENT_001",
    name: "Sam Client",
    email: "client@example.com",
    phone: "+1 (555) 111-2222",
    vehicleType: "Scooter", // N/A for client
    backgroundCheckStatus: "Approved", // N/A for client
    punchStatus: "Punched Out", // N/A for client
  },
};


export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [riderProfile, setRiderProfile] = useState<RiderProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Simulate fetching profile data
      setTimeout(() => {
        const profile = mockRiderProfiles[user.email] || {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: "N/A",
            vehicleType: "Bike",
            backgroundCheckStatus: "Pending",
            punchStatus: "Punched Out",
        };
        setRiderProfile(profile);
        setLoading(false);
      }, 500);
    }
  }, [user]);

  const handlePunchChange = (newStatus: RiderProfileData['punchStatus'], punchTime: string) => {
    if (riderProfile) {
      setRiderProfile(prev => prev ? { ...prev, punchStatus: newStatus, lastPunchTime: punchTime } : null);
      // In a real app, you'd also send this update to the backend.
    }
  };

  if (authLoading || loading || !user || !riderProfile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-8 w-2/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-lg" />
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }
  
  // Only Riders should see the PunchClock
  const canPunch = user.role === UserRoles.RIDER;

  return (
    <div className="space-y-8">
      <PageHeader 
        title="My Profile"
        description="View and manage your personal information and work status."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <RiderProfileDisplay profile={riderProfile} avatarUrl={user.avatarUrl} />
        </div>
        {canPunch && (
          <PunchClock 
            initialStatus={riderProfile.punchStatus} 
            initialLastPunchTime={riderProfile.lastPunchTime}
            onPunchChange={handlePunchChange}
          />
        )}
      </div>
    </div>
  );
}
