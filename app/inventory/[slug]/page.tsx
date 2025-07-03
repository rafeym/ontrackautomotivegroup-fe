import { fetchSanityQuery } from "@/lib/fetchSanity";
import { getAllCarSlugsQuery, getCarBySlugQuery } from "@/lib/queries";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { Suspense } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CarImageSection } from "@/components/CarImageGallery";
import BookAppointmentModal from "@/components/BookingAppointmentModal";
import { Separator } from "@/components/ui/separator";
import CarfaxButton from "@/components/CarfaxButton";
import { Metadata } from "next";
import SkeletonDetail from "@/components/SkeletonDetail";

export const revalidate = 86400;

export type paramsType = Promise<{ slug: string }>;

// Generate static params at build time
export async function generateStaticParams() {
  const slugs: { slug: string }[] = await fetchSanityQuery(getAllCarSlugsQuery);
  return slugs.map(({ slug }) => ({ slug }));
}

// Add generateMetadata for better SEO
export async function generateMetadata(props: {
  params: paramsType;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const car = await fetchSanityQuery(getCarBySlugQuery, { slug });

  if (!car) {
    return {
      title: "Car Not Found",
      description: "The requested vehicle could not be found.",
    };
  }

  const title = `${car.year} ${car.make} ${car.model} - Car Details`;
  const description = `View details for this ${car.year} ${car.make} ${car.model} including price, specifications, and more.`;

  // Preload the first image for better performance
  const firstImageUrl = car.images?.[0]?.url || car.images?.[0]?.asset?.url;

  return {
    title,
    description,
    other: firstImageUrl
      ? {
          'link[rel="preload"]': firstImageUrl,
        }
      : {},
  };
}

// Separate component for car details to enable streaming
async function CarDetails({ slug }: { slug: string }) {
  const car = await fetchSanityQuery(getCarBySlugQuery, { slug });

  if (!car) {
    return notFound();
  }

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Left: Main image and carousel */}
      <div className="w-full lg:w-2/3 flex flex-col">
        <div className="flex-none">
          <CarImageSection images={car.images} />
        </div>
        {car.description && (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold mb-0">Description</h3>
              <div className="hidden gap-2 min-[505px]:flex ">
                <BookAppointmentModal
                  car={{
                    vin: car.vin,
                    make: car.make,
                    model: car.model,
                    year: car.year,
                    mileage: car.mileage,
                    price: car.price,
                  }}
                  disabled={!car.isAvailable} // Disable booking if sold
                />
                <CarfaxButton carfaxPdf={car.carfaxPdf} />
              </div>
            </div>
            <p className="text-muted-foreground whitespace-pre-line mt-6">
              {car.description}
            </p>
          </div>
        )}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Dealership Information</h3>
          <div className="text-muted-foreground">
            <p className="font-medium">{car.dealership}</p>
            <p>{car.address}</p>
          </div>
          <div className="flex flex-col gap-2 mt-5 min-[505px]:hidden">
            <BookAppointmentModal
              car={{
                vin: car.vin,
                make: car.make,
                model: car.model,
                year: car.year,
                mileage: car.mileage,
                price: car.price,
              }}
              disabled={!car.isAvailable}
            />
            <CarfaxButton carfaxPdf={car.carfaxPdf} />
          </div>
        </div>
      </div>

      {/* Right: Car Details */}
      <div className="w-full lg:w-1/3 flex-none">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                {car.year} {car.make} {car.model} {car.trim}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-blue-600">
                  {formatCurrency(car.price)}
                </span>
                <span className="text-xs text-muted-foreground italic">
                  (Price before tax)
                </span>
              </div>
              <Badge
                variant={car.isAvailable ? "default" : "destructive"}
                className="text-sm px-3 py-1"
              >
                {car.isAvailable ? "Available" : "Sold"}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-base font-semibold">Key Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Trim</p>
                  <p className="text-sm font-medium">{car.trim}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">VIN</p>
                  <p className="text-sm font-medium">{car.vin}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Mileage</p>
                  <p className="text-sm font-medium">
                    {car.mileage?.toLocaleString()} km
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Transmission</p>
                  <p className="text-sm font-medium">{car.transmission}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Drivetrain</p>
                  <p className="text-sm font-medium">{car.drivetrain}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Engine</p>
                  <p className="text-sm font-medium">{car.engine}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-base font-semibold">Additional Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Fuel Type</p>
                  <p className="text-sm font-medium">{car.fuelType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Body Type</p>
                  <p className="text-sm font-medium">{car.bodyType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Condition</p>
                  <p className="text-sm font-medium">{car.condition}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Exterior Color
                  </p>
                  <p className="text-sm font-medium">{car.exteriorColor}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Interior Color
                  </p>
                  <p className="text-sm font-medium">{car.interiorColor}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default async function CarDetailsPage(props: { params: paramsType }) {
  const { slug } = await props.params;

  return (
    <Suspense fallback={<SkeletonDetail />}>
      <CarDetails slug={slug} />
    </Suspense>
  );
}
