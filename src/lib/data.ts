import type { Resource, UrgentRequest, DonationCamp, Donor, BloodType, Hospital } from './types';

export const hospitals: Hospital[] = [
  { name: 'D Y Patil Hospital', address: 'Sector 5, Nerul, Navi Mumbai', coordinates: [19.041, 73.022], rating: 5 },
  { name: 'Apollo Hospital', address: 'Sector 23, CBD Belapur, Navi Mumbai', coordinates: [19.018, 73.03], rating: 5 },
  { name: 'Fortis Hiranandani', address: 'Sector 10A, Vashi, Navi Mumbai', coordinates: [19.068, 73.001], rating: 5 },
  { name: 'MGM Hospital', address: 'Sector 18, Kamothe, Panvel', coordinates: [19.016, 73.09], rating: 5 },
  { name: 'Reliance Hospital', address: 'Thane-Belapur Road, Kopar Khairane', coordinates: [19.08, 73.01], rating: 5 },
  { name: 'Terna Speciality Hospital', address: 'Sector 22, Nerul West, Navi Mumbai', coordinates: [19.034, 73.018], rating: 5 },
  { name: 'Cloudnine Hospital', address: 'Sector 15, Vashi, Navi Mumbai', coordinates: [19.07, 72.998], rating: 5 },
  { name: 'Surya Hospital', address: 'Sector 9, Nerul, Navi Mumbai', coordinates: [19.037, 73.025], rating: 5 },
  { name: 'MPCT Hospital', address: 'Sector 14, Sanpada, Navi Mumbai', coordinates: [19.06, 73.008], rating: 5 },
  { name: 'Sterling Wockhardt Hospital', address: 'Sector 7, Vashi, Navi Mumbai', coordinates: [19.075, 72.995], rating: 5 },
  { name: 'Medicover Hospitals', address: 'Sector 10, Kharghar, Navi Mumbai', coordinates: [19.02, 73.065], rating: 5 },
  { name: 'Motherhood Hospital', address: 'Sector 5, Kharghar, Navi Mumbai', coordinates: [19.03, 73.07], rating: 5 },
  { name: 'Ashirwad Hospital', address: 'Sector 1, Seawoods, Nerul', coordinates: [19.03, 73.015], rating: 5 },
  { name: 'Lakshdeep Hospital', address: 'Sector 9, Vashi, Navi Mumbai', coordinates: [19.072, 72.999], rating: 5 },
  { name: 'Sai Snehdeep Hospital', address: 'Sector 1, Kopar Khairane', coordinates: [19.085, 73.005], rating: 5 }
];


const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Generate mock resources
export const initialResources: Resource[] = bloodTypes.flatMap((type, i) => 
  hospitals.map((hospital, j) => {
    const quantity = Math.floor(Math.random() * 100);
    let status: 'Available' | 'Low' | 'Critical' = 'Available';
    if (quantity < 10) status = 'Critical';
    else if (quantity < 30) status = 'Low';

    return {
      id: `res-${i}-${j}`,
      bloodType: type,
      quantity,
      location: hospital.name,
      status,
      hospital,
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
    hospitalName: 'Apollo Hospital',
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
    hospitalName: 'Fortis Hiranandani',
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
    hospitalName: 'D Y Patil Hospital',
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
    hospitalName: 'MGM Hospital',
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
  location: hospitals[index % hospitals.length].name,
  lastDonation: new Date(Date.now() - (30 + index * 15) * 24 * 60 * 60 * 1000).toISOString(),
  contact: {
    phone: `+91 987654321${index}`,
    email: `${name.toLowerCase().replace(/ /g, '.')}@example.com`,
  },
}));
