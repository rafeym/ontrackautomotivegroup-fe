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

// 1) Fetch all distinct makes
export const getAllMakesQuery = `
  // get array of all makes
  *[_type=="car"].make
`;

// 2) Fetch all models with their corresponding makes
export const getAllModelsQuery = `
  *[_type == "car"]{
    make,
    model,
    year
  }
`;

// 3) all years
export const getAllYearsQuery = `*[_type=="car"].year`;

// 4) all fuel types
export const getAllFuelTypesQuery = `*[_type=="car"].fuelType`;

// 5) all transmissions
export const getAllTransmissionsQuery = `*[_type=="car"].transmission`;

// 6) all body types
export const getAllBodyTypesQuery = `*[_type=="car"].bodyType`;

// Query to get the latest cars for the featured listing component
export const getLatestCarsQuery = `
  *[_type == "car"] | order(_createdAt desc)[0...3]{
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
