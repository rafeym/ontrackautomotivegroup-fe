import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HeroWithImage = () => {
  return (
    <section>
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <Image
          src="/heroimg.jpg"
          alt="Hero Image"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Find Your Next Ride
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Explore our curated collection of vehicles at unbeatable prices.
            Quality. Trust. Convenience.
          </p>
          <Link href="/inventory">
            <Button
              variant="secondary"
              className="bg-white text-black hover:bg-gray-200"
            >
              Browse Inventory
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroWithImage;
