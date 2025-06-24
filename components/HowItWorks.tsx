import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const steps = [
  {
    number: 1,
    title: "Browse Our Inventory",
    description:
      "Explore our curated selection of certified pre-owned vehicles and find the one that fits your needs.",
  },
  {
    number: 2,
    title: "Book a Test Drive",
    description:
      "Select a convenient time and we'll schedule your test drive — hassle-free and fast.",
  },
  {
    number: 3,
    title: "Drive Away Happy",
    description:
      "We'll guide you through a transparent buying process so you can drive away with confidence.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4 md:px-8 bg-white">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <p className="text-gray-600 text-lg">
          We make buying your next car simple, transparent, and stress-free.
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Vertical line behind the steps */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-300 z-0" />

        <div className="relative z-10">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-4 mb-16 last:mb-0"
            >
              {/* Step Circle */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-black text-white text-lg font-bold flex items-center justify-center z-10 relative">
                {step.number}
              </div>

              <Card className="flex-1 shadow-none border-none bg-transparent p-0">
                <CardContent className="p-0">
                  <h3 className="text-xl font-semibold mb-1">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Browse Inventory Button */}
      <div className="text-center mt-12">
        <Link href="/inventory">
          <Button
            size="lg"
            className="bg-black hover:bg-gray-800 text-white px-8 py-3"
          >
            Browse Inventory
          </Button>
        </Link>
      </div>
    </section>
  );
}
