import { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with OnTrackAutomotiveGroup. We're here to help you find your perfect vehicle.",
  openGraph: {
    title: "Contact OnTrackAutomotiveGroup",
    description:
      "Get in touch with OnTrackAutomotiveGroup. We're here to help you find your perfect vehicle.",
  },
};

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <p className="text-gray-600 mb-8">
          Have questions about our vehicles or services? Fill out the form below
          and we will get back to you as soon as possible.
        </p>
        <ContactForm />
      </div>
    </main>
  );
}
