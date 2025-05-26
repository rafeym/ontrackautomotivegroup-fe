import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-700 px-6 md:px-12 py-12 mt-20">
      <div className="max-w-7xl mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-black">
            OnTrack
            <span className="text-muted-foreground">AutomotiveGroup</span>
          </h3>
          <p className="text-sm text-gray-600">
            Your trusted partner for quality vehicles and unmatched service.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-semibold text-black mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Home", href: "/" },
              { name: "Inventory", href: "/inventory" },
              { name: "Contact", href: "/contact" },
              { name: "Favorites", href: "/favorites" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-black hover:underline transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold text-black mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              Email:{" "}
              <a
                href="mailto:ontrackautomotivegroup@gmail.com"
                className="text-blue-600 hover:underline"
              >
                ontrackautomotivegroup@gmail.com
              </a>
            </li>
            <li>
              Phone:{" "}
              <a
                href="tel:+16477661177"
                className="text-blue-600 hover:underline"
              >
                (647) 766-1177
              </a>
            </li>
            <li>247 Pefferlaw Rd, Pefferlaw, ON L0E 1N0</li>
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h4 className="font-semibold text-black mb-3">Business Hours</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Mon–Fri: 9:00am – 6:00pm</li>
            <li>Sat: 10:00am – 4:00pm</li>
            <li>Sun: Closed</li>
          </ul>
        </div>
      </div>

      <Separator className="my-10" />

      <div className="text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} OnTrackAutomotiveGroup. All rights
        reserved.
      </div>
    </footer>
  );
}
