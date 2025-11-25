import { z } from 'zod';

export const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export const urgencyLevels = ['Critical', 'High', 'Moderate'] as const;
export const broadcastRadii = ['5km', '10km'] as const;

export const urgentRequestSchema = z.object({
  bloodType: z.enum(bloodTypes, { required_error: 'Blood type is required' }),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1 unit'),
  urgency: z.enum(urgencyLevels, { required_error: 'Urgency level is required' }),
  hospitalName: z.string().min(1, 'Hospital name is required'),
  location: z.string().min(1, 'Location is required'),
  broadcastRadius: z.enum(broadcastRadii),
});

export const updateUnitsSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  quantity: z.coerce.number().min(0, 'Quantity cannot be negative'),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

export const campRegistrationSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    idProof: z
    .any()
    .refine((file) => file instanceof File, "ID Proof is required.")
    .refine((file) => file.size <= MAX_FILE_SIZE, `File size should be less than 5MB.`)
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Only .pdf files are accepted."
    ),
});
