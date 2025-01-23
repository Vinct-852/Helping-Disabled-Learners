// src/types/TravelPlan.ts

export interface Location {
  country: string;
  city: string;
}

export interface TravelPlan {
    id: number;
    destination: string;
    startDate: string;
    endDate: string;
    description: string;
  }
  