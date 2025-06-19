export type UserRole = "ADMIN" | "RIDER" | "CLIENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface RiderProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: 'Bike' | 'Scooter' | 'Car';
  backgroundCheckStatus: 'Pending' | 'Approved' | 'Rejected';
  punchStatus: 'Punched In' | 'Punched Out';
  lastPunchTime?: string; // ISO Date string
}

export interface VehicleTelemetryData {
  id: string;
  riderId: string;
  riderName: string;
  batteryPercent: number;
  currentLocation: { lat: number; lng: number; address: string };
  speedKmh: number;
  isOnline: boolean;
}

export interface SuggestedRider {
  riderId: string;
  riderName: string;
  riderLocation: string;
}
