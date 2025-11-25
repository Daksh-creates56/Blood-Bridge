import type { Resource, UrgentRequest, DonationCamp, Donor, BloodType } from './types';

const locations = [
  'D Y Patil Hospital, Nerul',
  'Apollo Hospital, Belapur',
  'Fortis Hiranandani, Vashi',
  'MGM Hospital, Kamothe',
  'Reliance Hospital, Kopar Khairane',
];

const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Generate mock resources
export const initialResources: Resource[] = bloodTypes.flatMap((type, i) => 
  locations.map((loc, j) => {
    const quantity = Math.floor(Math.random() * 100);
    let status: 'Available' | 'Low' | 'Critical' = 'Available';
    if (quantity < 10) status = 'Critical';
    else if (quantity < 30) status = 'Low';

    return {
      id: `res-${i}-${j}`,
      bloodType: type,
      quantity,
      location: loc,
      status,
    };
  })
);

// Generate mock urgent requests
export const initialUrgentRequests: UrgentRequest[] = [
  {
    id: 'req-1',
    bloodType: 'O-',
    quantity: 5,
    urgency: 'Critical',
    hospitalName: 'Apollo Hospital, Belapur',
    location: 'Belapur, Navi Mumbai',
    broadcastRadius: '10km',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'Active',
  },
  {
    id: 'req-2',
    bloodType: 'A+',
    quantity: 10,
    urgency: 'High',
    hospitalName: 'Fortis Hiranandani, Vashi',
    location: 'Vashi, Navi Mumbai',
    broadcastRadius: '5km',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
  },
  {
    id: 'req-3',
    bloodType: 'B+',
    quantity: 8,
    urgency: 'Moderate',
    hospitalName: 'D Y Patil Hospital, Nerul',
    location: 'Nerul, Navi Mumbai',
    broadcastRadius: '10km',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Fulfilled',
    fulfilledBy: 'Seawoods Blood Bank'
  },
    {
    id: 'req-4',
    bloodType: 'AB-',
    quantity: 3,
    urgency: 'Critical',
    hospitalName: 'MGM Hospital, Kamothe',
    location: 'Kamothe, Navi Mumbai',
    broadcastRadius: '10km',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Expired',
  },
];

// Generate mock donation camps
export const initialDonationCamps: DonationCamp[] = [
  {
    id: 'camp-1',
    name: 'Mega Blood Donation Drive',
    organizer: 'Lions Club of Vashi',
    location: 'Inorbit Mall, Vashi',
    address: 'Inorbit Mall, Palm Beach Rd, Sector 30A, Vashi',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    timings: '10:00 AM - 6:00 PM',
    coordinates: [19.063, 73.003],
  },
  {
    id: 'camp-2',
    name: 'Community Health Camp',
    organizer: 'Rotary Club of Belapur',
    location: 'Urban Haat, Belapur',
    address: 'CIDCO Urban Haat, Belapur',
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    timings: '9:00 AM - 5:00 PM',
    coordinates: [19.022, 73.033],
  },
  {
    id: 'camp-3',
    name: 'Youth For India Donation Camp',
    organizer: 'NSS Unit, SIES GST',
    location: 'SIES Graduate School of Technology, Nerul',
    address: 'SIES GST, Sri Chandrasekarendra Saraswati Vidyapuram, Nerul',
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    timings: '11:00 AM - 4:00 PM',
    coordinates: [19.044, 73.023],
  },
];

const donorNames = [
  'Aarav Sharma', 'Vivaan Singh', 'Aditya Kumar', 'Vihaan Gupta', 'Arjun Patel',
  'Saanvi Verma', 'Aanya Joshi', 'Aadhya Reddy', 'Ananya Roy', 'Diya Mehta'
];

// Generate mock donors
export const initialDonors: Donor[] = donorNames.map((name, index) => ({
  id: `donor-${index + 1}`,
  name,
  bloodType: bloodTypes[index % bloodTypes.length],
  location: locations[index % locations.length].split(',')[1].trim(),
  lastDonation: new Date(Date.now() - (30 + index * 15) * 24 * 60 * 60 * 1000).toISOString(),
  contact: {
    phone: `+91 987654321${index}`,
    email: `${name.toLowerCase().replace(/ /g, '.')}@example.com`,
  },
}));
