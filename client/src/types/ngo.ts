export interface NGOData {
  _id?: string;
  userId?: string;
  name: string;
  cause: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  description: string;
  registrationNumber?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NGOFormData {
  name: string;
  cause: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  description: string;
}