import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-700 px-6 md:px-12 py-10 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold text-black mb-2">
            OnTrack
            <span className="text-muted-foreground">AutomotiveGroup</span>
          </h3>
          <p>
            Your trusted partner for quality vehicles and unmatched service.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-semibold text-black mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/inventory">Inventory</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/favorites">Favorites</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold text-black mb-2">Contact</h4>
          <ul className="space-y-1 text-sm">
            <li>
              Email:{" "}
              <a
                href="mailto:ontrackautomotivegroup@gmail.com"
                className="underline"
              >
                ontrackautomotivegroup@gmail.com
              </a>
            </li>
            <li>
              Phone:{" "}
              <a href="tel:+16477661177" className="underline">
                (647) 766-1177
              </a>
            </li>
            <li>Location: 247 Pefferlaw Rd, Pefferlaw, ON L0E 1N0</li>
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h4 className="font-semibold text-black mb-2">Business Hours</h4>
          <ul className="space-y-1 text-sm">
            <li>Mon–Fri: 9:00am – 6:00pm</li>
            <li>Sat: 10:00am – 4:00pm</li>
            <li>Sun: Closed</li>
          </ul>
        </div>
      </div>

      <Separator className="my-8" />

      <div className="text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} OnTrackAutomotiveGroup. All rights
        reserved.
      </div>
    </footer>
  );
}
