// lib/queries.ts
export const getAllCarsQuery = `
  *[_type == "car"]{
     _id,
    vin,
    year,
    make,
    model,
    trim,
    images[]{ asset->{ url } },
    mileage,
    exteriorColor,
    interiorColor,
    fuelType,
    transmission,
    drivetrain,
    engine,
    bodyType,      
    condition,
    cityMpg,
    highwayMpg,
    price,
    dealership,
    address,
    slug,
    isAvailable,
    carfaxUrl
  }
`;

// Query to get all slugs (for generateStaticParams)
export const getAllCarSlugsQuery = `
  *[_type == "car" && defined(slug.current)]{
    "slug": slug.current
  }
`;

// Query to get full car data for a given slug
export const getCarBySlugQuery = `
  *[_type == "car" && slug.current == $slug][0]{
    _id,
    vin,
    year,
    make,
    model,
    trim,
    images,
    mileage,
    exteriorColor,
    interiorColor,
    fuelType,
    dealership,
    address,
    price,
    transmission,
    drivetrain,
    engine,
    bodyType,
    condition,
    cityMpg,
    highwayMpg,
    isAvailable,
    description,
    slug,
    carfaxUrl
  }
`;

// Query to get the latest cars for the featured listing component
export const getLatestCarsQuery = `
  *[_type == "car"] | order(_createdAt desc)[0...4]{
    _id,
    vin,
    year,
    make,
    model,
    trim,
    images,
    mileage,
    exteriorColor,
    interiorColor,
    fuelType,
    transmission,
    drivetrain,
    engine,
    bodyType,
    condition,
    cityMpg,
    highwayMpg,
    price,
    dealership,
    address,
    isAvailable,
    slug,
    carfaxUrl
  }
`;

// Combined query for all filter options
export const getAllFilterOptionsQuery = `{
  "makes": *[_type == "car"].make,
  "models": *[_type == "car"]{make, model, year},
  "years": *[_type == "car"].year,
  "fuelTypes": *[_type == "car"].fuelType,
  "transmissions": *[_type == "car"].transmission,
  "bodyTypes": *[_type == "car"].bodyType
}`;

export const getBookingsQuery = `*[_type == "booking"] | order(date desc) {
  _id,
  name,
  email,
  phone,
  timeSlot,
  date,
  status,
  bookingKey,
  car {
    vin,
    make,
    model,
    year,
    mileage,
    price
  }
}`;
