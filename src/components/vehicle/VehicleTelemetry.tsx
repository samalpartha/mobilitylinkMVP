"use client";

import type { VehicleTelemetryData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BatteryCharging, MapPin, Zap, AlertCircle, Wifi, WifiOff, UserCircle2 } from "lucide-react";

interface VehicleTelemetryProps {
  telemetry: VehicleTelemetryData;
}

export function VehicleTelemetry({ telemetry }: VehicleTelemetryProps) {
  
  const getBatteryIcon = (percentage: number) => {
    // Simplified, actual battery icons in lucide are BatteryFull, BatteryMedium, BatteryLow, BatteryEmpty
    return <BatteryCharging className={`h-5 w-5 ${percentage > 20 ? 'text-green-500' : 'text-red-500'}`} />;
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-headline flex items-center">
                <UserCircle2 className="mr-2 h-6 w-6 text-primary" />
                {telemetry.riderName}
            </CardTitle>
            <Badge variant={telemetry.isOnline ? "default" : "destructive"} className="bg-opacity-80">
                {telemetry.isOnline ? <Wifi className="mr-1 h-4 w-4"/> : <WifiOff className="mr-1 h-4 w-4"/>}
                {telemetry.isOnline ? "Online" : "Offline"}
            </Badge>
        </div>
        <CardDescription>Vehicle ID: {telemetry.id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-muted-foreground flex items-center">
              {getBatteryIcon(telemetry.batteryPercent)}
              <span className="ml-2">Battery</span>
            </span>
            <span className={`text-sm font-semibold ${telemetry.batteryPercent > 20 ? 'text-foreground' : 'text-red-500'}`}>
              {telemetry.batteryPercent}%
            </span>
          </div>
          <Progress value={telemetry.batteryPercent} aria-label={`Battery level: ${telemetry.batteryPercent}%`} className={telemetry.batteryPercent <=20 ? '[&>div]:bg-red-500' : ''}/>
        </div>
        
        <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                Location
            </span>
            <span className="text-foreground truncate" title={telemetry.currentLocation.address}>
                {telemetry.currentLocation.address}
            </span>
        </div>

        <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground flex items-center">
                <Zap className="mr-2 h-5 w-5 text-primary" />
                Speed
            </span>
            <span className={`font-semibold ${telemetry.speedKmh > 60 ? 'text-orange-500' : 'text-foreground'}`}>
                {telemetry.speedKmh} km/h
                {telemetry.speedKmh > 80 && <AlertCircle className="inline ml-1 h-4 w-4 text-red-500" />}
            </span>
        </div>

      </CardContent>
    </Card>
  );
}
