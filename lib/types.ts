// lib/types.ts

export interface Car {
  _id: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  images?: { asset: { _ref: string } }[];
  mileage?: number;
  exteriorColor?: string;
  interiorColor?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  dealership?: string;
  description?: string;
  drivetrain?: string;
  engine?: string;
  condition?: string;
  cityMpg?: number;
  highwayMpg?: number;
  isAvailable?: boolean;
  address?: string;
  price: number;
  slug: {
    current: string;
  };
  carfaxPdf?: {
    _id: string;
    url: string;
    originalFilename?: string;
  };
}
