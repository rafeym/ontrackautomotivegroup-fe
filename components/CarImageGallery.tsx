"use client";

import { useState } from "react";
import { urlFor } from "@/lib/imageUrl";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { X } from "lucide-react";
import Image from "next/image";

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
        <Image
          src={
            urlFor(selectedImage)?.width(800).height(600).quality(85).url() ||
            ""
          }
          alt="Main Car Image"
          width={800}
          height={600}
          className="w-full h-auto"
          priority={true}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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
            <Image
              src={urlFor(img)?.width(96).height(96).quality(75).url() || ""}
              alt={`Thumbnail ${index + 1}`}
              width={96}
              height={96}
              className="w-full h-full object-cover"
              loading={index < 3 ? "eager" : "lazy"}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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
          <Image
            src={
              urlFor(lightboxImage)
                ?.width(1200)
                .height(800)
                .quality(90)
                .url() || ""
            }
            alt="Enlarged Car Image"
            width={1200}
            height={800}
            className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-lg"
            priority={true}
          />
        </div>
      )}
    </>
  );
}

export function CarImageSection({ images }: { images: SanityImageSource[] }) {
  return <CarImageGallery images={images} />;
}
