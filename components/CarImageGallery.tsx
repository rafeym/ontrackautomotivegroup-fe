"use client";

import { useState } from "react";
import { urlFor } from "@/lib/imageUrl";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { X } from "lucide-react";

interface CarImageGalleryProps {
  images: SanityImageSource[];
}

export default function CarImageGallery({ images }: CarImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images?.[0]);
  const [lightboxImage, setLightboxImage] = useState<SanityImageSource | null>(
    null
  );

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* Main Image Section */}
      <div
        className="w-full rounded-lg overflow-hidden border cursor-pointer"
        onClick={() => setLightboxImage(selectedImage)}
      >
        <img
          src={urlFor(selectedImage)?.url()}
          alt="Main Car Image"
          width={800}
          height={400}
          className="w-full"
        />
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`flex-none w-24 h-24 border rounded overflow-hidden focus:outline-none ${
              img === selectedImage ? "ring-2 ring-blue-500" : ""
            }`}
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

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxImage(null);
            }}
          >
            <X />
          </button>
          <img
            src={urlFor(lightboxImage)?.url()}
            alt="Enlarged Car Image"
            className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-lg"
          />
        </div>
      )}
    </>
  );
}

export function CarImageSection({ images }: { images: SanityImageSource[] }) {
  return <CarImageGallery images={images} />;
}
