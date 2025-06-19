"use client";

import type { RiderProfileData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserCircle2, Mail, Phone, Bike, ShieldCheck, ShieldAlert, Info } from "lucide-react";

interface RiderProfileDisplayProps {
  profile: RiderProfileData;
  avatarUrl?: string;
}

const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length === 1) return names[0][0].toUpperCase();
  return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
}

export function RiderProfileDisplay({ profile, avatarUrl }: RiderProfileDisplayProps) {
  const statusVariant = {
    'Approved': 'default',
    'Pending': 'secondary',
    'Rejected': 'destructive',
  } as const;

  const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | React.ReactNode }) => (
    <div className="flex items-start space-x-3">
      <Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-md text-foreground">{value}</p>
      </div>
    </div>
  );

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="border-b">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage src={avatarUrl} alt={profile.name} data-ai-hint="rider portrait" />
            <AvatarFallback className="text-2xl">{getInitials(profile.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-3xl font-headline">{profile.name}</CardTitle>
            <CardDescription className="text-md">Rider ID: {profile.id}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <DetailItem icon={Mail} label="Email" value={profile.email} />
        <DetailItem icon={Phone} label="Phone" value={profile.phone} />
        <DetailItem icon={Bike} label="Vehicle Type" value={profile.vehicleType} />
        <DetailItem 
          icon={profile.backgroundCheckStatus === 'Approved' ? ShieldCheck : ShieldAlert} 
          label="Background Check" 
          value={
            <Badge variant={statusVariant[profile.backgroundCheckStatus]} className="text-sm px-3 py-1">
              {profile.backgroundCheckStatus}
            </Badge>
          } 
        />
        <DetailItem 
          icon={Info} 
          label="Current Status" 
          value={
            <Badge variant={profile.punchStatus === 'Punched In' ? 'default' : 'outline'} className="text-sm px-3 py-1">
              {profile.punchStatus}
            </Badge>
          } 
        />
        {profile.lastPunchTime && (
          <DetailItem 
            icon={Info} 
            label="Last Activity" 
            value={new Date(profile.lastPunchTime).toLocaleString()} 
          />
        )}
      </CardContent>
    </Card>
  );
}
