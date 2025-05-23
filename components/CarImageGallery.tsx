// components/CarImageGallery.tsx
"use client";

import { useState } from "react";
import { urlFor } from "@/lib/imageUrl";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface CarImageGalleryProps {
  images: SanityImageSource[];
}

export default function CarImageGallery({ images }: CarImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images?.[0]);

  if (!images || images.length === 0) return null;

  return (
    <div>
      <div className="w-full h-[400px] rounded-lg overflow-hidden border">
        <img
          src={urlFor(selectedImage)?.url()}
          alt="Main Car Image"
          width={800}
          height={400}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className="flex-none w-24 h-24 border rounded overflow-hidden focus:outline-none focus:ring-2 ring-blue-500"
          >
            <img
              src={urlFor(img)?.url()}
              alt={`Thumbnail ${index + 1}`}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function CarImageSection({ images }: { images: SanityImageSource[] }) {
  return <CarImageGallery images={images} />;
}
