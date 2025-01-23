// src/components/TravelPlans.tsx
import React from 'react';
import { TravelPlan } from '../../types/TravelPlan';
import travelPlansData from '../../data/travelPlans';

import TripCard, {  } from './Trip';

//reducer

const TravelPlans: React.FC = () => {
  const travelPlans: TravelPlan[] = travelPlansData;

  return (
    <div>
      <TripCard tripName='Kyoto Trip' 
      imageUrl='https://i.pinimg.com/736x/32/22/3f/32223fa443d284057951b6bc58fbf684.jpg'
      description='# family vacation'
      startDay='17/1/2025'
      endDay='18/1/2025'
      />
      
    </div>
  );
};

export default TravelPlans;
