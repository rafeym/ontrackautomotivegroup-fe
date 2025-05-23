import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const badges = [
  {
    title: "Satisfaction Guaranteed",
    description: "We prioritize your happiness with every purchase.",
  },
  {
    title: "Certified Pre-Owned",
    description: "Inspected and certified by our experts.",
  },
  {
    title: "Transparent Pricing",
    description: "No hidden fees. Just honest, upfront pricing.",
  },
  {
    title: "Experienced Advisors",
    description: "Guidance from real auto professionals.",
  },
];

export function AboutUs() {
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">More Than Just Cars</h2>
        <p className="text-gray-700 text-lg mb-5 leading-relaxed">
          At{" "}
          <span className="font-semibold text-black">
            OnTrackAutomotiveGroup
          </span>
          , we are committed to delivering more than just a great vehicle — we
          are here to give you peace of mind. From expert guidance to
          transparent pricing, discover what makes us different.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
        {badges.map((badge, idx) => (
          <Card
            key={idx}
            className="flex items-start gap-4 p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <CheckCircle
              className="text-green-600 mt-1 flex-shrink-0"
              size={28}
            />
            <div>
              <h4 className="text-base font-semibold mb-1">{badge.title}</h4>
              <p className="text-sm text-gray-600">{badge.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
