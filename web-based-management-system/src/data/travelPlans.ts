// src/data/travelPlans.ts
import { TravelPlan } from '../types/TravelPlan';

const travelPlans: TravelPlan[] = [
  {
    id: 1,
    destination: 'Paris, France',
    startDate: '2024-06-01',
    endDate: '2024-06-10',
    description: 'A week-long trip to explore the city of lights.',
  },
  {
    id: 2,
    destination: 'Tokyo, Japan',
    startDate: '2024-07-15',
    endDate: '2024-07-22',
    description: 'Experience the culture and cuisine of Japan.',
  },
  {
    id: 3,
    destination: 'New York City, USA',
    startDate: '2024-08-05',
    endDate: '2024-08-12',
    description: 'A fun-filled week in the Big Apple.',
  },
];

export default travelPlans;
