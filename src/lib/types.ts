export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type ResourceStatus = 'Available' | 'Low' | 'Critical';
export type UrgencyLevel = 'Critical' | 'High' | 'Moderate';
export type RequestStatus = 'Active' | 'Fulfilled' | 'Expired';

export type Hospital = {
  name: string;
  address: string;
  coordinates: [number, number];
  rating: number;
};

export type Resource = {
  id: string;
  bloodType: BloodType;
  quantity: number;
  location: string;
  status: ResourceStatus;
  hospital: Hospital;
};

export type UrgentRequest = {
  id: string;
  bloodType: BloodType;
  quantity: number;
  urgency: UrgencyLevel;
  hospitalName: string;
  location: string;
  broadcastRadius: '5km' | '10km';
  createdAt: string; // ISO 8601 string
  status: RequestStatus;
  fulfilledBy?: string;
};

export type DonationCamp = {
  id: string;
  name: string;
  organizer: string;
  location: string;
  address: string;
  date: string; // ISO 8601 string
  timings: string;
  coordinates: [number, number];
};

export type Donor = {
  id: string;
  name: string;
  bloodType: BloodType;
  location: string;
  lastDonation: string; // ISO 8601 string
  contact: {
    phone: string;
    email: string;
  };
};
