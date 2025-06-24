"use client";

import { Button } from "./ui/button";
import { FileText } from "lucide-react";

// Define the props the component accepts
const CarfaxButton = ({
  carfaxPdf,
}: {
  carfaxPdf?: {
    _id: string;
    url: string;
    originalFilename?: string;
  } | null;
}) => {
  // Add a check to disable the button if carfaxPdf is not provided
  return (
    <Button
      variant="outline"
      size="default"
      className="flex items-center gap-2"
      // Only add the onClick handler if carfaxPdf exists
      onClick={
        carfaxPdf?.url ? () => window.open(carfaxPdf.url, "_blank") : undefined
      }
      disabled={!carfaxPdf?.url} // Disable if no PDF is present
    >
      <FileText className="h-4 w-4" />
      View Carfax
    </Button>
  );
};

export default CarfaxButton;
